import { Document, Schema, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  passwordConfirm: string;
  image: string;
  posts: Types.ObjectId[];
}

const userSchema = new Schema<IUser & Document>({
  firstName: { type: String, required: [true, 'Please provide your first name'] },
  lastName: { type: String, required: [true, 'Please provide your last name'] },
  email: { type: String, required: [true, 'Please provide your email'], unique: true },
  image: { type: String, required: [true, 'Please provide your image'] },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: { type: String, required: [true, 'Please provide password'] },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords are not equals',
    },
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const UserModel = model<IUser & Document>('User', userSchema);

export default UserModel;
