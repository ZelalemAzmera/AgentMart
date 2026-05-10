import type { Agent, CreateAgentPayload } from '@/types';
import { apiGet, apiPost } from './client';

export const DeveloperAPI = {
  createAgent: async (payload: CreateAgentPayload, token: string): Promise<Agent> => {
    return apiPost('/agents', payload, token);
  },

  getDeveloperAgents: async (token: string): Promise<Agent[]> => {
    const data = await apiGet('/developer/agents', token);
    return data.agents;
  },

  getEarnings: async (token: string): Promise<{ totalEarnings: number; pendingPayouts: number }> => {
    return apiGet('/developer/stats', token);
  },
};
