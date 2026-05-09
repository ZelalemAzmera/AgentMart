import type { Agent, CreateAgentPayload } from '@/types';

const MODE = process.env.NEXT_PUBLIC_API_MODE || 'mock';

export const DeveloperAPI = {
  createAgent: async (payload: CreateAgentPayload, walletAddress: string): Promise<Agent> => {
    if (MODE === 'mock') {
      return new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              id: `agent-${Date.now()}`,
              ...payload,
              creator: walletAddress,
            }),
          1000
        )
      );
    }
    const res = await fetch('/api/developer/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, creator: walletAddress }),
    });
    return res.json();
  },

  getDeveloperAgents: async (walletAddress: string): Promise<Agent[]> => {
    if (MODE === 'mock') {
      return new Promise((resolve) => setTimeout(() => resolve([]), 500));
    }
    const res = await fetch(`/api/developer/agents?wallet=${walletAddress}`);
    return res.json();
  },

  getEarnings: async (walletAddress: string): Promise<{ totalVolume: number; pending: number }> => {
    if (MODE === 'mock') {
      return new Promise((resolve) =>
        setTimeout(() => resolve({ totalVolume: 12.5, pending: 1.2 }), 400)
      );
    }
    const res = await fetch(`/api/developer/earnings?wallet=${walletAddress}`);
    return res.json();
  },
};
