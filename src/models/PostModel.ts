import { Document, Schema, model, Types } from 'mongoose';

export interface IPost {
  creatorId: Types.ObjectId;
  text: string;
  image: string;
  rating: number;
  tmdbId: string;
  comments: Types.ObjectId[];
}

const postSchema = new Schema<IPost & Document>({
  creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true },
  tmdbId: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

const PostModel = model<IPost & Document>('Post', postSchema);

export default PostModel;
