import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  imageUrl: string;
  role?: string;
  googleId?: string;
  socketId?: string;
  tokens?: string[];
  _id?: string;
}

const userSchema = new Schema<IUser & Document>({
  fullName: { type: String, required: [true, "Please provide your first name"] },
  email: { type: String, required: [true, "Please provide your email"], unique: true },
  password: { type: String, required: [true, "Please provide password"], minlength: 8 },
  imageUrl: { type: String, required: [true, "Please provide your image"] },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  googleId: { type: String },
  socketId: { type: String },
  tokens: { type: [String] },
});

userSchema.pre("save", async function (next) {
  // Use salt to save the password on db
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});


const UserModel = model<IUser & Document>("User", userSchema);

export default UserModel;
