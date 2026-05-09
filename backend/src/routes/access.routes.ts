import { Router } from 'express';
import { checkAccess, grantAccess, getMyAgents } from '../controllers/access.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/check/:agentId', checkAccess);
router.get('/grant/:agentId', grantAccess);
router.get('/my-agents', getMyAgents);

export default router;
