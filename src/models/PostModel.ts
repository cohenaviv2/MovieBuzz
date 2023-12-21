import { Document, Schema, model, Types } from 'mongoose';

export interface IPost {
  creatorId: Types.ObjectId;
  tmdbMovieId: number;
  text: string;
  image: string;
  rate: number;
  commentsArray: Types.ObjectId[];
}

const postSchema = new Schema<IPost & Document>({
  creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tmdbMovieId: { type: Number, required: true },
  text: { type: String, required: true },
  image: { type: String, required: true },
  rate: { type: Number, required: true },
  commentsArray: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

const PostModel = model<IPost & Document>('Post', postSchema);

export default PostModel;
