import express from "express";
import { UserController } from "../controllers/UserController";
import auth, { restrict } from "../common/auth-middleware";

const router = express.Router();

router.get("/", auth, restrict, UserController.getAll.bind(UserController));
router.post("/online-users", UserController.getOnline.bind(UserController));//auth?
router.get("/:id",auth, UserController.getById.bind(UserController));
router.put("/:id",auth, UserController.updateById.bind(UserController));
router.delete("/:id", auth, restrict, UserController.deleteById.bind(UserController));

export default router;
