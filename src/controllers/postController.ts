import PostModel, { IPost } from "../models/PostModel";
import { BaseController } from "./BaseController";
import { AuthRequest } from "./AuthController";
import { Response } from "express";

class PostController extends BaseController<IPost> {
  constructor() {
    super(PostModel);
  }

  async create(req: AuthRequest, res: Response) {
    const _id = req.user._id;
    req.body.ownerId = _id;
    super.create(req, res);
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
