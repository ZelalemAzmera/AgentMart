import { z } from 'zod';

export const getNonceSchema = z.object({
  query: z.object({
    wallet: z.string().min(32).max(44, "Invalid Solana public key length"),
  })
});

export const verifySignatureSchema = z.object({
  body: z.object({
    walletAddress: z.string().min(32).max(44),
    signature: z.string().min(1),
    nonce: z.string().min(1)
  })
});
