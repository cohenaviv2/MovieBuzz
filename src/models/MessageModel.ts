import { Document, Schema, model } from "mongoose";

export interface IMessage extends Document {
  senderId: string;
  receiverId: string;
  text: string;
}

export interface IUserChat {
  _id: string;
  socketId: string;
  fullName: string;
  imageUrl: string;
}

const MessageSchema = new Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String, required: true },
});

const MessageModel = model<IMessage & Document>("Message", MessageSchema);

export default MessageModel;
