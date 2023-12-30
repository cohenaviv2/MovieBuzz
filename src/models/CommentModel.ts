import { Document, Schema, model, Types } from 'mongoose';

export interface IComment {
  ownerId: string;
  postId: string
  text: string;
}

const commentSchema = new Schema<IComment & Document>({
  ownerId: { type: String, ref: "User", required: true },
  postId: { type: String, ref: "User", required: true },
  text: { type: String, required: true },
});

const CommentModel = model<IComment & Document>('Comment', commentSchema);

export default CommentModel;
