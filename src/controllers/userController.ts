import UserModel, { IUser } from "../models/UserModel";
import { BaseController } from "./BaseController";
import { AuthRequest } from "./AuthController";
import { Response } from "express";

class UserController extends BaseController<IUser> {
  constructor() {
    super(UserModel);
  }

  async getById(req: AuthRequest, res: Response) {
    // const userId = req.user._id;
    // req.params.id = userId;
    // return super.getById(req, res);
    try {
      const userId = req.user._id;
      const user = await this.model.findById({ _id: userId });
      if (!user) {
        return res.status(404).send("No user found");
      } else {
        user.password = "";
        user.tokens = [];
        user.googleId = "";
        return res.send(user);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async updateById(req: AuthRequest, res: Response) {
    try {
      const userId = req.user._id;
      const newFullName = req.body.newFullName;
      const newPassword = req.body.newPassword;
      const newImageUrl = req.body.newImageUrl;
      const user = await this.model.findById({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      if (user.fullName !== newFullName) user.fullName = newFullName;
      if (newPassword !== "") user.password = newPassword;
      if (user.imageUrl !== newImageUrl) user.imageUrl = newImageUrl;
      await user.save();
      return res.status(200).send(user);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: error.message });
    }
  }

  async getOnlineUsers(req: AuthRequest, res: Response) {
    try {
      const userId = req.user._id;

      const onlineUsers = await this.model.find(
        { socketId: { $ne: null } }, // Include all users with a socketId, including the user with the specified userId
        "_id socketId fullName imageUrl"
      );
      res.send(onlineUsers);
    } catch (error) {
      console.error("Error fetching online users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateSocketId(userId: string, socketId: string) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate({ _id: userId }, { $set: { socketId } }, { new: true });

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

  static async removeSocketId(userId: string) {
    try {
      const user = await UserModel.findByIdAndUpdate({ _id: userId }, { $set: { socketId: null } }, { new: true });

      if (user) {
        console.log(`Socket ID ${user.socketId} removed from user ID ${user._id}`);
      } else {
        console.log(`User with socket ID ${user.socketId} not found`);
      }

      return user._id;
    } catch (error) {
      console.error("Error removing user socket ID:", error);
    }
  }
}

export { UserController as UserControllerClass };

export default new UserController();
