import { Router } from 'express';
import { getPendingAgents, approveAgent, rejectAgent } from '../controllers/admin.controller';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.use(requireAdmin);

router.get('/pending', getPendingAgents);
router.post('/approve/:id', approveAgent);
router.post('/reject/:id', rejectAgent);

export default router;
