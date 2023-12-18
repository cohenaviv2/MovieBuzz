import { Document, Schema, model, Types } from 'mongoose';

interface User {
  name: string;
  email: string;
  age: number;
  postsArray: Types.ObjectId[];
}

const userSchema = new Schema<User & Document>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  postsArray: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

const UserModel = model<User & Document>('User', userSchema);

export default UserModel;
