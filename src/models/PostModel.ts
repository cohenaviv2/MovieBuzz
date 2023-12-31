import { Document, Schema, model, Types } from "mongoose";

export interface IPost {
  ownerId: string;
  text: string;
  rating: number;
  tmdbId: string;
  commentIds: string[];
  createdAt: Date;
}

const postSchema = new Schema<IPost & Document>(
  {
    ownerId: { type: String, ref: "User", required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true },
    tmdbId: { type: String, required: true },
    commentIds: { type: [String], ref: "Comment" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const PostModel = model<IPost & Document>("Post", postSchema);

export default PostModel;
