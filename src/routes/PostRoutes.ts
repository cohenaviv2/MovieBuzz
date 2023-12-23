import express from 'express';
import PostController from '../controllers/PostController';
import AuthController from '../controllers/AuthController';

const router = express.Router();

router.post('/create', PostController.create.bind(PostController));
router.get('/getAll', AuthController.protect, AuthController.restrict, PostController.getAll.bind(PostController));
router.get('/get/:id', PostController.getById.bind(PostController));
router.put('/update/:id', PostController.updateById.bind(PostController));
router.delete('/delete/:id', PostController.deleteById.bind(PostController));

export default router;