import { Document, Schema, model, Types } from 'mongoose';

interface Comment {
  creatorId: Types.ObjectId;
  text: string;
}

const commentSchema = new Schema<Comment & Document>({
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
});

const CommentModel = model<Comment & Document>('Comment', commentSchema);

export default CommentModel;
