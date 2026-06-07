import { Router } from 'express';
import { sendMessage } from '../controllers/chatController.ts';

const router = Router();

router.post('/chat', sendMessage);

export default router;