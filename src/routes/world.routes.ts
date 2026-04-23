import {Router} from 'express';
import {authenticateToken} from '../middleware/auth.middleware.js';
import {
  saveState,
  loadState,
  lootBlock,
} from '../controllers/world.controller.js';

const router = Router();

router.use(authenticateToken);

router.post('/save', saveState);
router.get('/load', loadState);
router.post('/loot', lootBlock);

export default router;
