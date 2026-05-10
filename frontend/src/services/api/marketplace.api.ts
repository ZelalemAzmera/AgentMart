import type { Agent } from '@/types';
import { apiGet } from './client';

export const MarketplaceAPI = {
  getAgents: async (): Promise<{ agents: Agent[]; pagination: any }> => {
    return apiGet('/agents');
  },

  getAgentBySlug: async (slug: string): Promise<Agent | null> => {
    return apiGet(`/agents/${slug}`);
  },

  searchAgents: async (query: string): Promise<Agent[]> => {
    const data = await apiGet(`/agents?search=${encodeURIComponent(query)}`);
    return data.agents;
  },
};
