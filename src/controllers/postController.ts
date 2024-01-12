import PostModel, { IPost } from "../models/PostModel";
import { BaseController } from "./BaseController";
import { AuthRequest } from "./AuthController";
import { Request, Response } from "express";
import UserModel from "../models/UserModel";

class PostController extends BaseController<IPost> {
  constructor() {
    super(PostModel);
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const user = await UserModel.findById(req.user._id);
      req.body.ownerId = user._id;
      req.body.ownerName = user.fullName;
      req.body.ownerImageUrl = user.imageUrl;
      return super.create(req, res);
    } catch (err) {
      res.status(500).send(err);
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
