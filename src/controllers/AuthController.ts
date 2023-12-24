import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

async function register(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("missing email or password");
  }
  try {
    const findUser = await User.findOne({ email: email });
    if (findUser != null) {
      return res.status(406).send("email already exists");
    }
    const user = await User.create(req.body);
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

    const user = await User.findOne({ email: email });
    if (user == null) {
      return res.status(401).send("Incorrect email or password");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Incorrect email or password");
    }
    const id = { _id: user._id };
    const accessToken = jwt.sign(id, JWT_ACCESS_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(id, JWT_REFRESH_SECRET);

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
  const token = authHeader && authHeader.split(" ")[1]; // JWT <token>
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_REFRESH_SECRET, async (err, user) => {
    if (err) return res.status(403).send(err.message);
    const id = user as { _id: string };
    try {
      const user = await UserModel.findOne(id);
      if (user == null) res.status(403).send("Invalid request");
      if (!user.tokens.includes(token)) {
        user.tokens = []; // invalidate all user tokens
        await user.save();
        return res.status(403).send("Invalid request");
      }

      user.tokens.splice(user.tokens.indexOf(token), 1);
      await user.save();
      return res.status(200).send();
    } catch (error) {
      res.status(403).send(error.message);
    }
  });
}

export interface AuthRequest extends Request {
  user: { _id: string };
}

async function refreshToken(req: Request, res: Response) {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1]; // JWT <token>
  if (token == null) return res.status(401).send("token==null");

  jwt.verify(token, JWT_REFRESH_SECRET, async (err, user) => {
    if (err) return res.status(403).send(err.message);
    const id = user as { _id: string };
    try {
      const user = await UserModel.findOne(id);
      if (user == null) res.status(403).send("Invalid request");
      if (!user.tokens.includes(token)) {
        user.tokens = []; // invalidate all user tokens
        await user.save();
        return res.status(403).send("Invalid request");
      }

      const accessToken = jwt.sign(user._id, JWT_ACCESS_SECRET, { expiresIn: JWT_EXPIRES_IN });
      const refreshToken = jwt.sign(user._id, JWT_REFRESH_SECRET);

      user.tokens[user.tokens.indexOf(token)] = refreshToken;
      await user.save();
      return res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
      res.status(403).send(error.message);
    }
  });
}

async function restrict(req: AuthRequest, res: Response, next: NextFunction) {
  const user = await User.findById(req.user._id);
  if (user.role != "admin") {
    return res.status(403).send("You do not have pemission to this action");
  }
  next();
}

export default {
  register,
  login,
  logout,
  restrict,
  refreshToken,
};
