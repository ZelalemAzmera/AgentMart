export interface Agent {
  id: string;
  name: string;
  description: string;
  priceSOL: number;
  category: string;
  creator: string;
  previewImage: string;
  demoUrl?: string;
  creatorAvatar?: string;
}

export interface User {
  walletAddress: string;
  purchasedAgents: string[];
}

export interface Transaction {
  id: string;
  status: 'idle' | 'pending' | 'processing' | 'confirmed' | 'success' | 'failed';
  timestamp: number;
  agentId: string;
  walletAddress: string;
}

export interface CreateAgentPayload {
  name: string;
  description: string;
  category: string;
  priceSOL: number;
  previewImage: string;
  demoUrl: string;
}
