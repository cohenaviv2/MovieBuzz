import UserModel, { IUser } from '../models/UserModel';
import createController from './BaseController';

const commentController = createController<IUser>(UserModel);

export default commentController;
