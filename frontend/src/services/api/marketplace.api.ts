import type { Agent } from '@/types';
import { apiGet } from './client';

import { mockAgents } from '@/data/mock';

const isMock = process.env.NEXT_PUBLIC_API_MODE === 'mock';

export const MarketplaceAPI = {
  getAgents: async (): Promise<{ agents: Agent[]; pagination: any }> => {
    if (isMock) {
      return { agents: mockAgents, pagination: { total: mockAgents.length, pages: 1, page: 1, limit: 10 } };
    }
    return apiGet('/agents');
  },

  getAgentBySlug: async (slug: string): Promise<Agent | null> => {
    if (isMock) {
      return mockAgents.find((a) => a.slug === slug) || null;
    }
    return apiGet(`/agents/${slug}`);
  },

  searchAgents: async (query: string): Promise<Agent[]> => {
    if (isMock) {
      return mockAgents.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));
    }
    const data = await apiGet(`/agents?search=${encodeURIComponent(query)}`);
    return data.agents;
  },
};
