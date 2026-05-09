import type { User } from '@/types';

const MODE = process.env.NEXT_PUBLIC_API_MODE || 'mock';

export const WalletAPI = {
  getWalletState: async (walletAddress: string): Promise<User> => {
    if (MODE === 'mock') {
      return new Promise((resolve) =>
        setTimeout(() => resolve({ walletAddress, purchasedAgents: [] }), 300)
      );
    }
    const res = await fetch(`/api/wallet/${walletAddress}`);
    return res.json();
  },

  getUserPurchases: async (walletAddress: string): Promise<string[]> => {
    if (MODE === 'mock') {
      return new Promise((resolve) => setTimeout(() => resolve([]), 300));
    }
    const res = await fetch(`/api/wallet/${walletAddress}/purchases`);
    return res.json();
  },
};
