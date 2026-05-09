import { Router } from 'express';
import { becomeDeveloper, getDashboardStats, getMyListings, updateProfile } from '../controllers/developer.controller';
import { requireAuth, requireDeveloper } from '../middleware/auth';

const router = Router();

// Any buyer can become a developer
router.post('/become', requireAuth, becomeDeveloper);

// Only developers can access dashboard routes
router.use(requireDeveloper);

router.get('/dashboard', getDashboardStats);
router.get('/agents', getMyListings);
router.put('/profile', updateProfile);

export default router;
