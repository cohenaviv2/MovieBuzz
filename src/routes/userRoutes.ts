import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.post('/createUser', userController.createUser);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUser/:id', userController.getUserById);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);

export default router;
