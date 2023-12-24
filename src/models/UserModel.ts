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
  googleId?:string;
  posts: Types.ObjectId[];
  tokens: string[];
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
    validate: {
      validator: function (val: string) {
        return val === this.password;
      },
      message: 'Passwords are not equals',
    },
  },
  googleId: {type:String},
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  tokens : {
    type: [String]
  }
});

userSchema.pre('save', async function (next) {
  // Use salt to save the password on db
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
  next();
});

const UserModel = model<IUser & Document>('User', userSchema);

export default UserModel;
