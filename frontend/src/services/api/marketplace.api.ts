import type { Agent } from '@/types';
import { mockAgents } from '@/data/mock';

// Use environment variable or default to 'mock'
const MODE = process.env.NEXT_PUBLIC_API_MODE || 'mock';

export const MarketplaceAPI = {
  getAgents: async (): Promise<Agent[]> => {
    if (MODE === 'mock') {
      return new Promise((resolve) => setTimeout(() => resolve(mockAgents), 300));
    }
    const res = await fetch('/api/agents');
    return res.json();
  },

  getAgentById: async (id: string): Promise<Agent | null> => {
    if (MODE === 'mock') {
      const agent = mockAgents.find((a) => a.id === id);
      return new Promise((resolve) => setTimeout(() => resolve(agent || null), 200));
    }
    const res = await fetch(`/api/agents/${id}`);
    return res.json();
  },

  searchAgents: async (query: string): Promise<Agent[]> => {
    if (MODE === 'mock') {
      const results = mockAgents.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase())
      );
      return new Promise((resolve) => setTimeout(() => resolve(results), 300));
    }
    const res = await fetch(`/api/agents/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },
};
