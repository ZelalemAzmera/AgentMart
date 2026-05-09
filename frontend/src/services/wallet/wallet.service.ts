/**
 * Wallet Service Abstraction
 * This isolates UI components from actual Solana wallet logic.
 * Later, this can wrap @solana/wallet-adapter functions.
 */

const MODE = process.env.NEXT_PUBLIC_API_MODE || 'mock';

export const WalletService = {
  connectWallet: async (): Promise<string> => {
    if (MODE === 'mock') {
      return new Promise((resolve) => setTimeout(() => resolve('7xKm...3qPz'), 500));
    }
    // Replace with actual solana wallet adapter connection
    throw new Error('Real wallet connection not implemented');
  },

  disconnectWallet: async (): Promise<void> => {
    if (MODE === 'mock') {
      return new Promise((resolve) => setTimeout(resolve, 200));
    }
    // Replace with actual solana wallet adapter disconnection
    throw new Error('Real wallet disconnection not implemented');
  },

  signTransaction: async (txBase64: string): Promise<string> => {
    if (MODE === 'mock') {
      return new Promise((resolve) => setTimeout(() => resolve(`signed-${txBase64}`), 500));
    }
    // Replace with actual solana wallet adapter signTransaction
    throw new Error('Real transaction signing not implemented');
  },
};
