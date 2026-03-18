import {Router} from 'express';
import {getEntity, solveEntity} from '../controllers/entity.controller.js';
import {authenticateToken} from '../middleware/auth.middleware.js';

const router = Router();

router.get('/:id', authenticateToken, getEntity);
router.post('/:id/solve', authenticateToken, solveEntity);

export default router;
