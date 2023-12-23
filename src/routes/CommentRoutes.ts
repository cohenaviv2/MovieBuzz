import express from 'express';
import CommentController from '../controllers/CommentController';

const router = express.Router();

router.post('/create', CommentController.create.bind(CommentController));
router.get("/getAll", CommentController.getAll.bind(CommentController));
router.get("/get/:id", CommentController.getById.bind(CommentController));
router.put("/update/:id", CommentController.updateById.bind(CommentController));
router.delete('/delete/:id', CommentController.deleteById.bind(CommentController));

export default router;
