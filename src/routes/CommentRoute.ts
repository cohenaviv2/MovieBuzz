import express from "express";
import CommentController from "../controllers/CommentController";

const router = express.Router();

router.get("/", CommentController.getAll.bind(CommentController));
router.get("/:id", CommentController.getById.bind(CommentController));
router.post("/", CommentController.create.bind(CommentController));
router.put("/:id", CommentController.updateById.bind(CommentController));
router.delete("/:id", CommentController.deleteById.bind(CommentController));

export default router;
