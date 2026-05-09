import { Router } from 'express';
import { verifyPurchase, getMyPurchases, getPurchaseDetails } from '../controllers/purchase.controller';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { verifyPurchaseSchema } from '../schemas/purchase.schema';

const router = Router();

router.use(requireAuth); // All purchase routes require auth

router.post('/verify', validate(verifyPurchaseSchema), verifyPurchase);
router.get('/my', getMyPurchases);
router.get('/:id', getPurchaseDetails);

export default router;
