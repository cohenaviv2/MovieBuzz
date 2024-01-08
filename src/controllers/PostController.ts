import PostModel, { IPost } from "../models/PostModel";
import { BaseController } from "./BaseController";
import { AuthRequest } from "./AuthController";
import { Request, Response } from "express";
import { getMovieById } from "../controllers/MovieController";

class PostController extends BaseController<IPost> {
  constructor() {
    super(PostModel);
  }

  async create(req: AuthRequest, res: Response) {
    req.body.ownerId = req.user._id;
    return super.create(req, res);
  }

  async find(req: AuthRequest, res: Response) {
    try {
      const userId = req.user._id;
      const userItems = await this.model.find({ ownerId: userId });
      if (userItems.length == 0) {
        res.status(404).send({ error: "No items found" });
      }
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

  async getByMostCommented(req: Request, res: Response) {
    try {
      const posts = await PostModel.find().sort({ numOfComments: -1 }).exec();
      return res.send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
}

export default new PostController();
