import { Document, Schema, model, Types } from "mongoose";

export interface IPost {
  ownerId: string;
  ownerName?: string;
  ownerImageUrl?: string;
  text: string;
  rating: number;
  imageUrl?: string;
  tmdbId: string;
  tmdbTitle?: string;
  tmdbImageUrl?: string;
  numOfComments?: number;
  createdAt?: Date;
}

const postSchema = new Schema<IPost & Document>(
  {
    ownerId: { type: String, ref: "User", required: true },
    ownerName: { type: String, required: true },
    ownerImageUrl: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    tmdbId: { type: String, required: true },
    tmdbTitle: { type: String, required: true },
    tmdbImageUrl: { type: String, required: true },
    numOfComments: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const PostModel = model<IPost & Document>("Post", postSchema);

export default PostModel;
