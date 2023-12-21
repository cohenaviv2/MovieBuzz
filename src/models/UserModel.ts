import { Document, Schema, model, Types } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  age: number;
  postsArray: Types.ObjectId[];
}

const userSchema = new Schema<IUser & Document>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  postsArray: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

const UserModel = model<IUser & Document>('User', userSchema);

export default UserModel;
