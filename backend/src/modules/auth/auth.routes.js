import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { loginSchema, refreshSchema, logoutSchema } from './auth.validation.js';
import { login, refresh, logout, me } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshSchema), refresh);
router.post('/logout', validate(logoutSchema), logout);
router.get('/me', requireAuth, me);

export default router;

