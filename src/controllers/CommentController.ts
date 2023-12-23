import CommentModel, {IComment} from "../models/CommentModel";
import createController from "./BaseController";

const commentController = createController<IComment>(CommentModel);

export default commentController;