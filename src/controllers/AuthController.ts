import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export interface AuthRequest extends Request {
  user: { _id: string };
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
    return res.status(201).send({ _id: user._id });
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
    const userInfo = { _id: user._id };
    const accessToken = jwt.sign(userInfo, JWT_ACCESS_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(userInfo, JWT_REFRESH_SECRET);

    if (user.tokens == null) user.tokens = [refreshToken];
    else user.tokens.push(refreshToken);
    await user.save();
    return res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (err) {
    return res.status(400).send({ status: "fail", message: err.message });
  }
}

async function logout(req: Request, res: Response) {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // JWT <refreshToken>
  if (refreshToken == null) return res.sendStatus(401);

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, user) => {
    if (err) return res.status(403).send(err.message);
    const userInfo = user as { _id: string };
    try {
      const user = await UserModel.findById(userInfo._id);
      // if (user == null) res.status(403).send("Invalid request");
      if (!user.tokens || !user.tokens.includes(refreshToken)) {
        user.tokens = []; // invalidate all user tokens
        await user.save();
        return res.status(403).send("Invalid request");
      }

      user.tokens.splice(user.tokens.indexOf(refreshToken), 1);
      await user.save();
      return res.sendStatus(200);
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
    const userInfo = user as { _id: string };
    try {
      const user = await UserModel.findById(userInfo._id);
      if (user == null) res.status(403).send("Invalid request");
      if (!user.tokens || !user.tokens.includes(refreshToken)) {
        user.tokens = []; // invalidate all user tokens
        await user.save();
        return res.status(403).send("Invalid request");
      }

      const newAccessToken = jwt.sign(userInfo, JWT_ACCESS_SECRET, { expiresIn: JWT_EXPIRES_IN });
      const newRefreshToken = jwt.sign(userInfo, JWT_REFRESH_SECRET);

      user.tokens[user.tokens.indexOf(refreshToken)] = newRefreshToken;
      await user.save();
      return res.status(200).send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
      console.log(error.message);
      res.status(403).send(error.message);
    }
  });
}

export default {
  register,
  login,
  logout,
  refreshToken,
};
