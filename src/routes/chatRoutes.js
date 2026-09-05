import { Router } from 'express';
import { sendMessage } from '../controllers/chatController.js';
import { translateMiddleware } from '../middlewares/translateMiddleware.js';

const router = Router();

router.post('/chat', translateMiddleware, sendMessage);

export default router;