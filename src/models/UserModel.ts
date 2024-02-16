import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  fullName: string;
  email: string;
  role: string;
  password: string;
  imageUrl: string;
  googleId?: string;
  socketId: string;
  tokens: string[];
  _id?: string;
}

const userSchema = new Schema<IUser & Document>({
  fullName: { type: String, required: [true, "Please provide your first name"] },
  email: { type: String, required: [true, "Please provide your email"], unique: true },
  password: { type: String, required: [true, "Please provide password"] },
  imageUrl: { type: String, required: [true, "Please provide your image"] },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  googleId: { type: String },
  socketId: { type: String },
  tokens: { type: [String] },
});

userSchema.pre("save", async function (next) {
  // Use salt to save the password on db
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const UserModel = model<IUser & Document>("User", userSchema);

export default UserModel;
