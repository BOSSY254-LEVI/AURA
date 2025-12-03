// server/routes/evidenceRoutes.ts
import { Router } from 'express';
import { getEvidenceItems, createEvidenceItem, deleteEvidenceItem } from '../controllers/evidenceController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/', isAuthenticated, getEvidenceItems);
router.post('/', isAuthenticated, createEvidenceItem);
router.delete('/:id', isAuthenticated, deleteEvidenceItem);

export default router;
