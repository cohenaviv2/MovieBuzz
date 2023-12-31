import PostModel, { IPost } from "../models/PostModel";
import { BaseController } from "./BaseController";
import { AuthRequest } from "./AuthController";
import { Request, Response } from "express";
import { uploadImage, getImage } from "../common/multer-config";

export interface ImageRequest extends AuthRequest {
  targetFolder: string;
  fileName: string;
}

class PostController extends BaseController<IPost> {
  constructor() {
    super(PostModel);
  }

  async create(req: ImageRequest, res: Response) {
    const userId = req.user._id;
    req.body.ownerId = userId;

    console.log(req);

    if (req.file == null) return res.status(404).send("File not found");

    try {
      const postData = req.body;
      const newPost = await this.model.create(postData);

      req.targetFolder = "/posts";
      req.fileName = newPost._id.toString();
      await uploadImage(req, res);

      return res.status(201).send(newPost);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: error.message });
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
