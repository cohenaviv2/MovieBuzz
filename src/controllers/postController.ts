import PostModel, { IPost } from "../models/PostModel";
import { BaseController } from "./BaseController";
import { AuthRequest } from "./AuthController";
import { Request, Response } from "express";
import UserModel from "../models/UserModel";

class PostController extends BaseController<IPost> {
  constructor() {
    super(PostModel);
  }

  limit = 30;

  async create(req: AuthRequest, res: Response) {
    try {
      const user = await UserModel.findById(req.user._id);
      req.body.ownerId = user._id;
      req.body.ownerName = user.fullName;
      req.body.ownerImageUrl = user.imageUrl;
      return super.create(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }

  async find(req: AuthRequest, res: Response) {
    try {
      const userId = req.user._id;
      const userItems = await this.model.find({ ownerId: userId });
      if (userItems.length == 0) {
        res.status(404).send("No posts found");
      } else res.send(userItems);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const searchTerms = req.query.query as string;
      if (!searchTerms) {
        res.status(400).json({ error: "Query parameter is required" });
        return;
      }
      const searchTermRegex = new RegExp(searchTerms, "i");

      const results = await this.model.find({
        $or: [{ tmdbTitle: { $regex: searchTermRegex } }, { ownerName: { $regex: searchTermRegex } }, { tmdbId: searchTerms }],
      });

      if (results.length == 0) {
        res.status(404).send("No posts found");
      } else {
        res.json(results);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async getByRecency(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const startIndex = (page - 1) * this.limit;

      const posts = await PostModel.find().sort({ createdAt: -1 }).skip(startIndex).limit(this.limit).exec();

      return res.send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async getByTopRated(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const startIndex = (page - 1) * this.limit;

      const posts = await PostModel.find().sort({ rating: -1 }).skip(startIndex).limit(this.limit).exec();

      return res.send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async getByMostCommented(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const startIndex = (page - 1) * this.limit;

      const posts = await PostModel.find().sort({ numOfComments: -1 }).skip(startIndex).limit(this.limit).exec();

      return res.send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
}

export default new PostController();
