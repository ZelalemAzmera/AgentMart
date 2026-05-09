import { Router } from 'express';
import { getDemoUrl, logDemoUsage } from '../controllers/demo.controller';

const router = Router();

router.get('/:agentId', getDemoUrl);
router.post('/:agentId/log', logDemoUsage);

export default router;
