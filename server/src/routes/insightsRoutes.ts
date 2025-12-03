// server/routes/insightsRoutes.ts
import { Router } from 'express';
import { getSafetyInsights, createSafetyInsight } from '../controllers/insightsController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/', isAuthenticated, getSafetyInsights);
router.post('/', isAuthenticated, createSafetyInsight);

export default router;
