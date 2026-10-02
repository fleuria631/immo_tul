import express from 'express';
import { register, login, getMe, updateMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validateRegister, authenticate, register); // First user can bypass auth via logic in controller
router.post('/login', validateLogin, login);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);

export default router;
