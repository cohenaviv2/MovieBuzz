import { Document, Schema, model, Types } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // For regular sign-up
  googleId?: string; // For Google sign-up
  image: string;
  posts?: Types.ObjectId[]; // Array of Post IDs created by the user
}

const userSchema = new Schema<IUser & Document>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  password: { type: String }, // For regular sign-up
  googleId: { type: String }, // For Google sign-up
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

const UserModel = model<IUser & Document>("User", userSchema);

export default UserModel;
