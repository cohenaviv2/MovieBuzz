import express from "express";
import MessageController from "../controllers/MessageController";
import auth from "../common/auth-middleware";

const router = express.Router();

router.post("/get-conversation",auth, MessageController.getConversation.bind(MessageController));

export default router;
