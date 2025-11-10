import { Router } from 'express';
import { login, register } from '../controllers/authController.js';

const router = Router();

// Ruta para POST /api/auth/login
router.post('/login', login);

// Ruta para POST /api/auth/register
router.post('/register', register);

export default router;