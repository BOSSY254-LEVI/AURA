// server/routes/authRoutes.ts
import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route example
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

export default router;