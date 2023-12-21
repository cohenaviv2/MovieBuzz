import express from 'express';
import UserController from '../controllers/UserController';

const router = express.Router();

router.post("/create", UserController.create.bind(UserController));
router.get("/getAll", UserController.getAll.bind(UserController));
router.get("/get/:id", UserController.getById.bind(UserController));
router.put("/update/:id", UserController.updateById.bind(UserController));
router.delete("/delete/:id", UserController.deleteById.bind(UserController));

export default router;
