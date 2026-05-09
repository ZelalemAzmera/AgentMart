import { z } from 'zod';

export const verifyPurchaseSchema = z.object({
  body: z.object({
    agentId: z.string().cuid(),
    txSignature: z.string().min(64).max(100),
  })
});
