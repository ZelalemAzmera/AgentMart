'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet } from 'lucide-react';
import { useWalletStore } from '@/lib/store';
import { WalletService } from '@/services/wallet/wallet.service';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const { connect } = useWalletStore();

  const handleConnect = async () => {
    const address = await WalletService.connectWallet();
    connect(address);
    onClose();
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
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md px-4"
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
                className="w-full py-3 px-6 rounded-md bg-white text-black font-medium transition-all hover:bg-zinc-200"
              >
                Connect Phantom
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
