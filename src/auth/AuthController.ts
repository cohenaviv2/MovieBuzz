import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (req: Request, res: Response) => {
  try {
    const itemData = req.body;
    const newUser = await User.create(itemData);
    const token = signToken(newUser._id);
    return res.status(200).send({
      user: newUser,
      accessToken: token,
    });
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
    const user = await User.findOne({
      email: email,
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Incorrect email or password");
    }
    const token = signToken(user._id);
    return res.status(200).send({
      accessToken: token,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const logout = async (req: Request, res: Response) => {
  res.status(400).send("unimplemented");
};

export interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).send("You are not logged in! Please log in to get access");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user as {
      id: string;
    };
    next();
  });
};

const restrict = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user.id);
  if (user.role != "admin") {
    return res.status(403).send("You do not have pemission to this action");
  }
  next();
};

export default {
  register,
  login,
  logout,
  protect,
  restrict,
};
