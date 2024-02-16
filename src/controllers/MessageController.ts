import MessageModel, { IMessage } from "../models/MessageModel";
import { BaseController } from "./BaseController";
import { AuthRequest } from "./AuthController";
import { Response } from "express";

class MessageController extends BaseController<IMessage> {
  constructor() {
    super(MessageModel);
  }

  async getConversation(req: AuthRequest, res: Response) {
    try {
      const { senderId, receiverId } = req.body;
      const conversation = await this.model.find(
        {
          $or: [
            { senderId, receiverId },
            { sender: receiverId, receiver: senderId },
          ],
        },
        { _id: 0 }
      );
      res.send(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async savePrivateMessage(senderId: string, receiverId: string, text: string) {
    try {
      const message = await this.model.create({ senderId, receiverId, text });
      return message;
    } catch (error) {
      console.error("Error saving message:", error.message);
      return null;
    }
  }
}

export default new MessageController();
