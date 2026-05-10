import { apiGet, apiPost } from './client';

export const AuthAPI = {
  getNonce: (wallet: string): Promise<{ nonce: string }> => apiGet(`/auth/nonce?wallet=${wallet}`),
  verify: (walletAddress: string, signature: string, nonce: string): Promise<{ user: any; token: string }> =>
    apiPost('/auth/verify', { walletAddress, signature, nonce }),
};
