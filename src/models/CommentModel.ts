import { Document, Schema, model, Types } from 'mongoose';

export interface IComment {
  creatorId: Types.ObjectId;
  text: string;
}

const commentSchema = new Schema<IComment & Document>({
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
});

const CommentModel = model<IComment & Document>('Comment', commentSchema);

export default CommentModel;
