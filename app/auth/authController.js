import express from 'express';
import { loginUser, logoutUser, getUserInfo } from '../auth/authService.js';
import { authenticate } from "../middleware/authMiddleware.js"
const router = express.Router();

router.post('/login', loginUser);

router.get('/logout', logoutUser);

router.get('/info', authenticate, getUserInfo)


export default router;