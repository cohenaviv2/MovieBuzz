import UserModel, { IUser } from "../models/UserModel";
import { BaseController } from "./BaseController";
import { AuthRequest } from "./AuthController";
import { Response } from "express";

class UserController extends BaseController<IUser> {
  constructor() {
    super(UserModel);
  }

  async getById(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    if (req.params.id != userId) return res.sendStatus(403);
    else return super.getById(req, res);
  }

  async updateById(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    if (req.params.id != userId) return res.sendStatus(403);
    else return super.updateById(req, res);
  }
}

export default new UserController();
