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
    req.params.id = userId;
    return super.getById(req, res);
  }

  async updateById(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    req.params.id = userId;
    return super.updateById(req, res);
  }

  async getOnlineUsers(req: AuthRequest, res: Response) {
    try {
      const userId = req.user._id;

      const onlineUsers = await this.model.find(
        { socketId: { $exists: true, $ne: null }, _id: { $ne: userId } }, // Exclude user with the specified userId
        "_id socketId fullName"
      );

      res.send(onlineUsers);
    } catch (error) {
      console.error("Error fetching online users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateSocketId(userId:string, socketId:string) {
    try {
      const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, { $set: { socketId } }, { new: true });

      if (!updatedUser) {
        console.log(`User with ID ${userId} not found.`);
      } else {
        console.log(`Socket ID ${socketId} associated with user ID ${userId}`);
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user socket ID:", error);
    }
  }

  static async removeSocketId(socketId:string) {
    try {
      const user = await UserModel.findOneAndUpdate({ socketId }, { $set: { socketId: null } }, { new: true });

      if (user) {
        console.log(`Socket ID ${socketId} removed from user ID ${user._id}`);
      } else {
        console.log(`User with socket ID ${socketId} not found`);
      }

      return user._id;
    } catch (error) {
      console.error("Error removing user socket ID:", error);
    }
  }
}

export { UserController as UserControllerClass };

export default new UserController();

