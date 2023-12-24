import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export function signToken(id: string): string {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}
const register = async (req: Request, res: Response) => {
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
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const login = async (req: Request, res: Response) => {
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

    const token = signToken(user._id);
    return res.status(200).send({ accessToken: token });
  } catch (err) {
    return res.status(400).json({ status: "fail", message: err.message });
  }
};

const logout = async (req: Request, res: Response) => {
  res.status(400).send("unimplemented");
};

export interface AuthRequest extends Request {
  user: { _id: string };
}

const restrict = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user._id);
  if (user.role != "admin") {
    return res.status(403).send("You do not have pemission to this action");
  }
  next();
};

export default {
  register,
  login,
  logout,
  restrict
};
