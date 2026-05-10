'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet } from 'lucide-react';
import { useWalletStore, useAuthStore } from '@/lib/store';
import { AuthAPI } from '@/services/api/auth.api';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const { connect } = useWalletStore();
  const { setToken } = useAuthStore();
  const { select, wallets } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      // 1. Select and connect Phantom
      const phantom = wallets.find((w) => w.adapter.name === 'Phantom');
      if (phantom) {
        select(phantom.adapter.name);
        await phantom.adapter.connect();
      }

      const phantomAdapter = phantom?.adapter as any;
      if (!phantomAdapter?.publicKey || !phantomAdapter?.signMessage) {
        throw new Error('Wallet not ready');
      }

      const walletAddress = phantomAdapter.publicKey.toBase58();

      // 2. Get Nonce
      const { nonce } = await AuthAPI.getNonce(walletAddress);

      // 3. Sign Message
      const message = new TextEncoder().encode(`Sign this message to authenticate with AgentMart.\nNonce: ${nonce}`);
      const signatureBytes = await phantomAdapter.signMessage(message);
      const signature = bs58.encode(signatureBytes);

      // 4. Verify & get JWT
      const { token } = await AuthAPI.verify(walletAddress, signature, nonce);

      // 5. Store auth state
      setToken(token);
      connect(walletAddress);
      onClose();
    } catch (error: any) {
      console.error('Connection error:', error);
      alert(`Connection Failed: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md px-4"
          >
            <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-8 text-center shadow-2xl relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-[#71717a] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#27272a] flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-medium text-white mb-2">Connect Wallet</h2>
              <p className="text-[#a1a1aa] text-sm mb-8">
                Connect your Solana wallet to purchase AI agents and manage your deployments.
              </p>
              <button
                onClick={handleConnect}
                disabled={loading}
                className="w-full py-3 px-6 rounded-md bg-white text-black font-medium transition-all hover:bg-zinc-200 disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect Phantom'}
              </button>
              <p className="mt-4 text-[10px] text-[#71717a] uppercase tracking-widest">
                Devnet Mode Enabled
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
