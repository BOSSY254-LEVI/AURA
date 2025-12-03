// server/routes/communityRoutes.ts
import { Router } from 'express';
import { getCommunityReports, createCommunityReport } from '../controllers/communityController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/reports', isAuthenticated, getCommunityReports);
router.post('/reports', isAuthenticated, createCommunityReport);

export default router;
