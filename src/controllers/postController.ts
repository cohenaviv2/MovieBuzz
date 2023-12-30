import PostModel, { IPost } from "../models/PostModel";
import { BaseController } from "./BaseController";
import { AuthRequest } from "./AuthController";
import { Request, Response } from "express";

class PostController extends BaseController<IPost> {
  constructor() {
    super(PostModel);
  }

  async create(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    req.body.ownerId = userId;
    return super.create(req, res);
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

  async getByRecency(req: Request, res: Response) {
    try {
      const posts = await PostModel.find().sort({ createdAt: -1 }).exec();
      return res.send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async getByTopRated(req: Request, res: Response) {
    try {
      const posts = await PostModel.find().sort({ rating: -1 }).exec();
      return res.send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async getPostsByMostCommented(req: Request, res: Response) {
    try {
      const posts = await PostModel.aggregate([
        {
          $addFields: {
            commentCount: { $size: "$commentIds" }, // Add a field with the size of commentIds array
          },
        },
        { $sort: { commentCount: -1 } }, // Sort by the commentCount field in descending order
      ]).exec();
      return res.send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
}

export default new PostController();
