import { Document, Schema, model, Types } from "mongoose";

export interface IPost {
  ownerId: string;
  text: string;
  rating: number;
  tmdbId: string;
  imageUrl?: string;
  numOfComments?: number;
  createdAt?: Date;
}

const postSchema = new Schema<IPost & Document>(
  {
    ownerId: { type: String, ref: "User", required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true },
    tmdbId: { type: String, required: true },
    imageUrl: { type: String, required: true },
    numOfComments: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const PostModel = model<IPost & Document>("Post", postSchema);

export default PostModel;
