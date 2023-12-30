import { Document, Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  fullName: string;
  email: string;
  role: string;
  password: string;
  image: string;
  googleId?: string;
  tokens: string[];
  _id?: string;
}

const userSchema = new Schema<IUser & Document>({
  fullName: { type: String, required: [true, "Please provide your first name"] },
  email: { type: String, required: [true, "Please provide your email"], unique: true },
  image: { type: String, required: [true, "Please provide your image"] },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  password: { type: String, required: [true, "Please provide password"] },
  googleId: { type: String },
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
