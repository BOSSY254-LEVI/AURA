// server/routes/emergencyContactRoutes.ts
import { Router } from 'express';
import { getEmergencyContacts, createEmergencyContact, deleteEmergencyContact } from '../controllers/emergencyContactController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/', isAuthenticated, getEmergencyContacts);
router.post('/', isAuthenticated, createEmergencyContact);
router.delete('/:id', isAuthenticated, deleteEmergencyContact);

export default router;
