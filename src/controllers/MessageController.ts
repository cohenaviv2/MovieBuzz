import MessageModel, { IMessage } from "../models/MessageModel";
import { BaseController } from "./BaseController";
import { AuthRequest } from "./AuthController";
import { Response } from "express";

class MessageController extends BaseController<IMessage> {
  constructor() {
    super(MessageModel);
  }

  static async getConversation(req: AuthRequest, res: Response) {
    try {
      const { sender, receiver } = req.body;
      const conversation = await MessageModel.find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      }, { _id: 0 }); // Exclude the _id field from the returned documents
      res.send(conversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  

  static async savePrivateMessage({ sender, receiver, text }) {
    try {
      const message = new MessageModel({ sender, receiver, text });
      await message.save();
      return message;
    } catch (error) {
      console.error('Error saving message:', error.message);
      return null;
    }
  }
}

export default MessageController;
