import { Request, Response } from "express";
import CommentModel, { IComment } from "../models/CommentModel";
import { AuthRequest } from "./AuthController";
import { BaseController } from "./BaseController";
import PostModel from "../models/PostModel";
import UserModel from "../models/UserModel";

class CommentsController extends BaseController<IComment> {
  constructor() {
    super(CommentModel);
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const post = await PostModel.findById(req.body.postId);
      if (post == null) return res.status(404).send("Invalid post id");
      post.numOfComments = post.numOfComments + 1;
      await post.save();
      const user = await UserModel.findById(req.user._id);
      req.body.ownerId = user._id;
      req.body.ownerName = user.fullName;
      req.body.ownerImageUrl = user.imageUrl;
      return super.create(req, res);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: err.message });
    }
  }

  async find(req: AuthRequest, res: Response) {
    try {
      const userId = req.user._id;
      const userItems = await this.model.find({ ownerId: userId });
      if (userItems.length == 0) {
        res.status(404).send({ error: "No items found" });
      }
      return res.send(userItems);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
  async getUserComments(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const userItems = await this.model.find({ ownerId: userId });
      if (userItems.length == 0) {
        return res.status(404).send({ error: "No comments found" });
      }
      return res.status(200).send(userItems);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
  async getPostComments(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      const postItems = await this.model.find({ postId: postId });
      if (postItems.length == 0) {
        return res.status(404).send({ error: "No comments found" });
      }
      return res.status(200).send(postItems);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
}

export default new CommentsController();
