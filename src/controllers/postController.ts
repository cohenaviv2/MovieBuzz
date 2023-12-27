import PostModel, {IPost} from "../models/PostModel";
import { BaseController } from "./BaseController";
import { AuthRequest } from "./AuthController";
import { Response } from "express";

class PostController extends BaseController<IPost> {
    constructor() {
        super(PostModel);
    }

    async post(req :AuthRequest, res : Response) {
        const id = req.user._id;
       
    }
}

export default new PostController;
