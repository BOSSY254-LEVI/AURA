// server/routes/threatRoutes.ts
import { Router } from 'express';
import { getThreats, createThreat, updateThreat } from '../controllers/threatController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/', isAuthenticated, getThreats);
router.post('/', isAuthenticated, createThreat);
router.patch('/:id', isAuthenticated, updateThreat);

export default router;
