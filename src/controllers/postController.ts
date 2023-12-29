import PostModel, { IPost } from "../models/PostModel";
import { BaseController } from "./BaseController";
import { AuthRequest } from "./AuthController";
import { Response } from "express";
import UserModel from "../models/UserModel";

class PostController extends BaseController<IPost> {
  constructor() {
    super(PostModel);
  }

  async create(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    req.body.ownerId = userId;
    try {
      const newPost = await this.model.create(req.body);
      const user = await UserModel.findById(userId);
      user.postIds.push(newPost._id.toString());
      await user.save();
      return res.status(201).send(newPost);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: err.message });
    }
  }

  async deleteById(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    try {
      const itemId = req.params.id;
      const deletedItem = await this.model.findByIdAndDelete(itemId);
      if (!deletedItem) {
        return res.status(404).send({ error: "Comment not found" });
      }
      // Remove the deleted post ID from the user's postIds array
      const user = await UserModel.findById(userId);
      const postIndex = user.postIds.indexOf(itemId);
      if (postIndex !== -1) {
        user.postIds.splice(postIndex, 1);
      }
      await user.save();
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async find(req: AuthRequest, res: Response) {
    try {
      const ownerId = req.user._id as string;
      const userItems = await this.model.find({ ownerId: ownerId });
      res.send(userItems);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
}

export default new PostController();
