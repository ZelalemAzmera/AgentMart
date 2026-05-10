import type { Agent } from '@/types';
import { apiGet } from './client';

import { mockAgents } from '@/data/mock';

const isMock = process.env.NEXT_PUBLIC_API_MODE === 'mock';

export const MarketplaceAPI = {
  getAgents: async (): Promise<{ agents: Agent[]; pagination: any }> => {
    try {
      const data = await apiGet('/agents');
      // Merge live agents with mock agents so the site looks full!
      return { 
        agents: [...data.agents, ...mockAgents], 
        pagination: data.pagination 
      };
    } catch (error) {
      // Fallback to purely mock if the server is completely down
      return { agents: mockAgents, pagination: { total: mockAgents.length, pages: 1, page: 1, limit: 10 } };
    }
  },

  getAgentBySlug: async (slug: string): Promise<Agent | null> => {
    // First check if it's a mock agent
    const mockAgent = mockAgents.find((a) => a.slug === slug);
    if (mockAgent) return mockAgent;

    // Otherwise try to fetch from live backend
    try {
      return await apiGet(`/agents/${slug}`);
    } catch (error) {
      return null;
    }
  },

  searchAgents: async (query: string): Promise<Agent[]> => {
    try {
      const data = await apiGet(`/agents?search=${encodeURIComponent(query)}`);
      const filteredMocks = mockAgents.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));
      return [...data.agents, ...filteredMocks];
    } catch (error) {
      return mockAgents.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));
    }
  },
};
