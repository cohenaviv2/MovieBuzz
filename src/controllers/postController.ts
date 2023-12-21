import PostModel, {IPost} from "../models/PostModel";
import createController from "./BaseController";

const commentController = createController<IPost>(PostModel);

export default commentController;
