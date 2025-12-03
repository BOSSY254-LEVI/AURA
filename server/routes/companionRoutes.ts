// server/routes/companionRoutes.ts
import { Router } from 'express';
import { getCompanionChat, upsertCompanionChat } from '../controllers/companionController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/chat', isAuthenticated, getCompanionChat);
router.post('/chat', isAuthenticated, upsertCompanionChat);

export default router;
