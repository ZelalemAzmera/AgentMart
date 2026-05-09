import type { Transaction } from '@/types';

const MODE = process.env.NEXT_PUBLIC_API_MODE || 'mock';

export const TransactionsAPI = {
  createPurchase: async (agentId: string, walletAddress: string): Promise<{ txHash: string }> => {
    if (MODE === 'mock') {
      return new Promise((resolve) =>
        setTimeout(() => resolve({ txHash: `mockTx-${agentId}-${Date.now()}` }), 800)
      );
    }
    const res = await fetch('/api/transactions/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, walletAddress }),
    });
    return res.json();
  },

  verifyPurchase: async (txHash: string): Promise<Transaction> => {
    if (MODE === 'mock') {
      return new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              id: txHash,
              status: 'success',
              timestamp: Date.now(),
              agentId: txHash.split('-')[1], // mock decoding
              walletAddress: 'mock-wallet-addr',
            }),
          1500
        )
      );
    }
    const res = await fetch(`/api/transactions/verify/${txHash}`);
    return res.json();
  },
};
