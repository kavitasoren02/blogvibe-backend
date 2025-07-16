import express from 'express';
import UserController from '../user/Usercontroller.js';
import AuthController from '../auth/authController.js';
import BlogController from '../blogger/BloggerController.js';
import CommentController from '../comment/CommentController.js';
import uploadRouter from '../imagefile/UploadFileController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import LikeController from '../likes/LikeController.js';
import Dashboard from '../dashboard/Dashboard.js';

const router = express.Router();

router.use('/user', UserController);

router.use('/auth', AuthController);

router.use('/author', BlogController);

router.use('/blogs', CommentController);

router.use('/file',authenticate, uploadRouter);

router.use('/like', authenticate, LikeController);

router.use('/dashboard', authenticate, Dashboard);


export default router;