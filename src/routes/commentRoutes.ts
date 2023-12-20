import express from 'express';
import * as commentController from '../controllers/commentController';

const router = express.Router();

router.post('/createComment', commentController.createComment);
router.get('/getAllComments', commentController.getAllComments);
router.get('/getComment/:id', commentController.getCommentById);
router.put('/updateComment/:id', commentController.updateComment);
router.delete('/deleteComment/:id', commentController.deleteComment);

export default router;
