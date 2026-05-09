import { Router } from 'express';
import { getAgents, getAgentBySlug, createAgent, updateAgent, getCategories } from '../controllers/agent.controller';
import { validate } from '../middleware/validate';
import { requireDeveloper } from '../middleware/auth';
import { createAgentSchema, updateAgentSchema, getAgentsQuerySchema } from '../schemas/agent.schema';

const router = Router();

router.get('/', validate(getAgentsQuerySchema), getAgents);
router.get('/categories', getCategories);
router.get('/:slug', getAgentBySlug);

router.post('/', requireDeveloper, validate(createAgentSchema), createAgent);
router.put('/:id', requireDeveloper, validate(updateAgentSchema), updateAgent);

export default router;
