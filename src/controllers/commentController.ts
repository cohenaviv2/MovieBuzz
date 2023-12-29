import { Response } from "express";
import CommentModel, { IComment } from "../models/CommentModel";
import { AuthRequest } from "./AuthController";
import { BaseController } from "./BaseController";

class CommentsController extends BaseController<IComment> {
  constructor() {
    super(CommentModel);
  }

  async create(req : AuthRequest, res : Response){
    const _id = req.user._id;
    req.body.ownerId = _id;
    return super.create(req,res);
  }
}

export default new CommentsController();
