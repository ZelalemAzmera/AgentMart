import { Router } from 'express';
import { getNonce, verifySignature, getCurrentUser } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { getNonceSchema, verifySignatureSchema } from '../schemas/auth.schema';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/nonce', validate(getNonceSchema), getNonce);
router.post('/verify', validate(verifySignatureSchema), verifySignature);
router.get('/me', requireAuth, getCurrentUser);

export default router;
