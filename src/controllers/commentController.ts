import { Response } from "express";
import CommentModel, { IComment } from "../models/CommentModel";
import { AuthRequest } from "./AuthController";
import { BaseController } from "./BaseController";
import PostModel from "../models/PostModel";

class CommentsController extends BaseController<IComment> {
  constructor() {
    super(CommentModel);
  }

  async create(req: AuthRequest, res: Response) {
    const _id = req.user._id;
    req.body.ownerId = _id;
    try {
      const commentData = req.body;
      const post = await PostModel.findById(commentData.postId);
      if (post == null) return res.status(404).send("Invalid post id");
      const newComments = await this.model.create(commentData);
      post.numOfComments = post.numOfComments + 1;
      await post.save();
      return res.status(201).send(newComments);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: err.message });
    }
  }

  async find(req: AuthRequest, res: Response) {
    try {
      const userId = req.user._id;
      const userItems = await this.model.find({ ownerId: userId });
      res.send(userItems);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
}

export default new CommentsController();
