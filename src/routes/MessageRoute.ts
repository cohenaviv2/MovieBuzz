import express from "express";
import MessageController from "../controllers/MessageController";
// import auth, { restrict } from "../common/auth-middleware";

const router = express.Router();

router.post("/getConversation", MessageController.getConversation.bind(MessageController));//auth?

export default router;
