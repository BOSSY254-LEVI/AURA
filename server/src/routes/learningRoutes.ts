// server/routes/learningRoutes.ts
import { Router } from 'express';
import { getLearningProgress, upsertLearningProgress } from '../controllers/learningController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/progress', isAuthenticated, getLearningProgress);
router.post('/complete', isAuthenticated, upsertLearningProgress);

export default router;
