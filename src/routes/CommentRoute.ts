import express from "express";
import CommentController from "../controllers/CommentController";
import authMiddleware from "../auth/authMiddleware";

const router = express.Router();

router.get("/", CommentController.getAll.bind(CommentController));
router.get("/:id", CommentController.getById.bind(CommentController));
router.post("/", authMiddleware, CommentController.create.bind(CommentController));
router.put("/:id", authMiddleware, CommentController.updateById.bind(CommentController));
router.delete("/:id", authMiddleware, CommentController.deleteById.bind(CommentController));

export default router;
