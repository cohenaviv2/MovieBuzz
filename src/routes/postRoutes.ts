import express from 'express';
import * as postController from '../controllers/postController';

const router = express.Router();

router.post('/createPost', postController.createPost);
router.get('/getAllPosts', postController.getAllPosts);
router.get('/getPost/:id', postController.getPostById);
router.put('/updatePost/:id', postController.updatePost);
router.delete('/deletePost/:id', postController.deletePost);

export default router;
