import express from "express";
import PostController from "../controllers/PostController";
import authMiddleware from "../auth/AuthMiddleware";

const router = express.Router();

router.get("/", PostController.getAll.bind(PostController));
router.get("/:id", PostController.getById.bind(PostController));
router.post("/", authMiddleware, PostController.create.bind(PostController));
router.put("/:id", authMiddleware, PostController.updateById.bind(PostController));
router.delete("/:id", authMiddleware, PostController.deleteById.bind(PostController));

export default router;
