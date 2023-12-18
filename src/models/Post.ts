import { Document, Schema, model, Types } from 'mongoose';

interface Post {
  creatorId: Types.ObjectId;
  movieName: string;
  text: string;
  image: string;
  rate: number;
  commentsArray: Types.ObjectId[];
}

const postSchema = new Schema<Post & Document>({
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  movieName: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: String, required: true },
  rate: { type: Number, required: true },
  commentsArray: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

const PostModel = model<Post & Document>('Post', postSchema);

export default PostModel;
