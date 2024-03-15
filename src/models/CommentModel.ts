import { Document, Schema, model } from "mongoose";

export interface IComment {
  ownerId: string;
  ownerName?: string;
  ownerImageUrl?: string;
  postId: string;
  text: string;
  _id?: string;
}

const commentSchema = new Schema<IComment & Document>({
  ownerId: { type: String, ref: "User", required: true },
  ownerName: { type: String, required: true },
  ownerImageUrl: { type: String, required: true },
  postId: { type: String, ref: "User", required: true },
  text: { type: String, required: true },
});

const CommentModel = model<IComment & Document>("Comment", commentSchema);

export default CommentModel;
