export interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  priceSOL: number;
  category: string;
  tags: string[];
  imageUrl?: string;
  demoUrl?: string;
  agentUrl?: string;
  totalSales: number;
  createdAt: string;
  developer: {
    id: string;
    displayName: string | null;
    walletAddress: string;
    avatarUrl: string | null;
  };
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
  shortDesc: string;
  category: string;
  priceSOL: number;
  imageUrl: string;
  demoUrl: string;
  agentUrl: string;
}
