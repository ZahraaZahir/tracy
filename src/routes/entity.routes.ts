import { Router } from 'express';
import { getEntity } from '../controllers/entity.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/:id', authenticateToken, getEntity);
export default router;