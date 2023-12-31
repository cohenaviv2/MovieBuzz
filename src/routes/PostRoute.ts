import express from "express";
import PostController from "../controllers/PostController";
import auth from "../common/auth-middleware";

const router = express.Router();

router.get("/", PostController.getAll.bind(PostController));
router.get("/recent", PostController.getByRecency.bind(PostController));
router.get("/top-rated", PostController.getByTopRated.bind(PostController));
router.get("/most-commented", PostController.getPostsByMostCommented.bind(PostController));
router.get("/find", auth, PostController.find.bind(PostController));
router.get("/:id", PostController.getById.bind(PostController));
router.post("/", auth, PostController.create.bind(PostController));
router.put("/:id", auth, PostController.updateById.bind(PostController));
router.delete("/:id", auth, PostController.deleteById.bind(PostController));

export default router;
