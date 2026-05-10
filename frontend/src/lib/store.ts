import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Agent, Transaction } from '@/types';

// --- Wallet Store ---
interface WalletStore {
  connected: boolean;
  address: string | null;
  balance: number;
  connect: (address: string) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  connected: false,
  address: null,
  balance: 0,
  connect: (address) => set({ connected: true, address, balance: 12.5 }), // Mock balance
  disconnect: () => set({ connected: false, address: null, balance: 0 }),
}));

// --- Marketplace Store ---
interface MarketplaceStore {
  agents: Agent[];
  selectedAgent: Agent | null;
  setAgents: (agents: Agent[]) => void;
  setSelectedAgent: (agent: Agent | null) => void;
}

export const useMarketplaceStore = create<MarketplaceStore>((set) => ({
  agents: [],
  selectedAgent: null,
  setAgents: (agents) => set({ agents }),
  setSelectedAgent: (selectedAgent) => set({ selectedAgent }),
}));

// --- Cart Store ---
interface CartStore {
  cart: Agent[];
  addToCart: (agent: Agent) => void;
  removeFromCart: (agentId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  addToCart: (agent) =>
    set((state) => ({
      cart: state.cart.some((a) => a.id === agent.id) ? state.cart : [...state.cart, agent],
    })),
  removeFromCart: (agentId) =>
    set((state) => ({
      cart: state.cart.filter((a) => a.id !== agentId),
    })),
  clearCart: () => set({ cart: [] }),
}));

// --- Transaction Store ---
interface TransactionStore {
  pendingTransactions: Transaction[];
  transactionStatus: Transaction['status'];
  addTransaction: (tx: Transaction) => void;
  updateTransactionStatus: (status: Transaction['status']) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  pendingTransactions: [],
  transactionStatus: 'idle',
  addTransaction: (tx) =>
    set((state) => ({ pendingTransactions: [...state.pendingTransactions, tx] })),
  updateTransactionStatus: (transactionStatus) => set({ transactionStatus }),
}));

// --- Library Store (Purchased Agents) ---
interface LibraryStore {
  purchased: Agent[];
  addPurchased: (agent: Agent) => void;
}

export const useLibraryStore = create<LibraryStore>((set) => ({
  purchased: [],
  addPurchased: (agent) =>
    set((state) => ({
      purchased: state.purchased.some((a) => a.id === agent.id)
        ? state.purchased
        : [...state.purchased, agent],
    })),
}));

// --- Auth Store ---
interface AuthStore {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    { name: 'agentmart-auth' }
  )
);
