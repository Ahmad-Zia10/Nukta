import express from 'express';
import { signup, login, logout, getCurrentUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

export default router;
