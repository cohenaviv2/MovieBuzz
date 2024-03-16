import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel, { IUser } from "../models/UserModel";
import { OAuth2Client } from "google-auth-library";
import { Document } from "mongoose";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export interface AuthRequest extends Request {
  user: { _id: string };
}

export interface IAuth {
  accessToken: string;
  refreshToken: string;
  accessTokenExpirationTime: string;
  user: IUserDetails;
}

export interface IUserDetails {
  userId: string;
  fullName: string;
  imageUrl: string;
}

export interface UserId {
  _id: string;
}

async function generateTokens(user: Document & IUser) {
  const userInfo = { _id: user._id, time: new Date() };
  const accessToken = jwt.sign(userInfo, JWT_ACCESS_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign(userInfo, JWT_REFRESH_SECRET);

  if (user.tokens == null) user.tokens = [refreshToken];
  else user.tokens.push(refreshToken);

  await user.save();

  const userDetails: IUserDetails = {
    fullName: user.fullName,
    userId: user._id,
    imageUrl: user.imageUrl,
  };
  const tokens: IAuth = {
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenExpirationTime: JWT_EXPIRES_IN,
    user: userDetails,
  };
  return tokens;
}

async function register(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("missing email or password");
  }
  try {
    const findUser = await UserModel.findOne({ email: email });
    if (findUser != null) {
      return res.status(406).send("email already exists");
    }
    const user = await UserModel.create(req.body);
    const userId: UserId = {
      _id: user._id,
    };
    return res.status(201).send(userId);
  } catch (err) {
    return res.status(400).send({ status: "fail", message: err.message });
  }
}

async function login(req: Request, res: Response) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return res.status(400).send("Please provide email and password");
    }

    const user = await UserModel.findOne({ email: email });
    if (user == null) {
      return res.status(401).send("Incorrect email or password");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Incorrect email or password");
    }
    if (user.googleId != null) {
      return res.status(401).send("Unauthorize, use Google login");
    }

    const tokens = await generateTokens(user);
    return res.status(200).send(tokens);
  } catch (err) {
    return res.status(400).send({ status: "fail", message: err.message });
  }
}

const client = new OAuth2Client();
async function googleSignin(req: Request, res: Response) {
  const credential = req.body.credential;
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    if (email != null) {
      let user = await UserModel.findOne({ email: email });
      if (user == null) {
        const newGoogleUser: IUser = {
          fullName: payload?.given_name + " " + payload?.family_name,
          email: email,
          password: "googlegoogle",
          imageUrl: payload?.picture,
          googleId: payload?.sub,
        };
        user = await UserModel.create(newGoogleUser);
      }
      const tokens = await generateTokens(user);
      res.status(200).send(tokens);
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
}

async function logout(req: Request, res: Response) {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // JWT <refreshToken>
  if (refreshToken == null) return res.sendStatus(401);

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).send(err.message);
    }
    const userInfo = user as { _id: string; time: Date };
    try {
      const user = await UserModel.findById({ _id: userInfo._id });
      // if (user == null) res.status(403).send("Invalid request");
      if (!user.tokens || !user.tokens.includes(refreshToken)) {
        user.tokens = []; // invalidate all user tokens
        await user.save();
        return res.status(403).send("Invalid request");
      } else {
        user.tokens = user.tokens.filter((t) => t !== refreshToken);
        await user.save();
        return res.sendStatus(200);
      }

      // user.tokens.splice(user.tokens.indexOf(refreshToken), 1);
      // await user.save();
      // return res.sendStatus(200);
    } catch (error) {
      res.status(403).send(error.message);
    }
  });
}

async function refreshToken(req: Request, res: Response) {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // JWT <refreshToken>
  if (refreshToken == null) return res.sendStatus(401);

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, user) => {
    if (err) return res.status(403).send(err.message);
    const userInfo = user as { _id: string; time: Date };
    try {
      const user = await UserModel.findById({ _id: userInfo._id });
      if (user == null) res.status(403).send("Invalid request");
      if (!user.tokens || !user.tokens.includes(refreshToken)) {
        user.tokens = []; // invalidate all user tokens
        await user.save();
        return res.status(403).send("Invalid request");
      }
      const newPayload = {_id:user._id,time:new Date()}
      const newAccessToken = jwt.sign(newPayload, JWT_ACCESS_SECRET, { expiresIn: JWT_EXPIRES_IN });
      const newRefreshToken = jwt.sign(newPayload, JWT_REFRESH_SECRET);

      user.tokens = user.tokens.filter((t) => t !== refreshToken);
      user.tokens.push(newRefreshToken);
      // user.tokens[user.tokens.indexOf(refreshToken)] = newRefreshToken;
      await user.save();

      const userDetails: IUserDetails = {
        fullName: user.fullName,
        userId: user._id,
        imageUrl: user.imageUrl,
      };
      const newTokens: IAuth = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenExpirationTime: JWT_EXPIRES_IN,
        user: userDetails,
      };
      // console.log("Refresh: ", newTokens);
      return res.status(200).send(newTokens);
    } catch (error) {
      console.log(error.message);
      res.status(403).send(error.message);
    }
  });
}

export default {
  register,
  login,
  googleSignin,
  logout,
  refreshToken,
};
