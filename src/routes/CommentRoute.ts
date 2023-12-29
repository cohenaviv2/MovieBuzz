import express from "express";
import CommentController from "../controllers/CommentController";
import auth from "../common/auth-middleware";

const router = express.Router();

router.get("/", CommentController.getAll.bind(CommentController));
router.get("/:id", CommentController.getById.bind(CommentController));
router.post("/", auth, CommentController.create.bind(CommentController));
router.put("/:id", auth, CommentController.updateById.bind(CommentController));
router.delete("/:id", auth, CommentController.deleteById.bind(CommentController));

export default router;
