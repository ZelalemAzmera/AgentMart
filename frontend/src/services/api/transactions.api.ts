import type { Transaction } from '@/types';
import { apiGet, apiPost } from './client';

export const TransactionsAPI = {
  createPurchase: async (agentId: string, txSignature: string, token: string): Promise<{ purchase: any }> => {
    return apiPost('/purchases', { agentId, txSignature }, token);
  },

  verifyPurchase: async (purchaseId: string, token: string): Promise<any> => {
    return apiGet(`/purchases/${purchaseId}`, token);
  },
};
