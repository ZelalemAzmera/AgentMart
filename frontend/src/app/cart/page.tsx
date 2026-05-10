'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useWalletStore, useLibraryStore, useTransactionStore } from '@/lib/store';
import { TransactionsAPI } from '@/services/api/transactions.api';
import { Trash2, ShoppingCart, ArrowRight, Loader2, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { handlePurchase } from '@/utils/handlePurchase';
import { useAuthStore } from '@/lib/store';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCartStore();
  const { connected, address } = useWalletStore();
  const { token } = useAuthStore();
  const wallet = useWallet();
  const { addPurchased } = useLibraryStore();
  const { transactionStatus, updateTransactionStatus } = useTransactionStore();
  
  const totalPrice = cart.reduce((acc, agent) => acc + agent.priceSOL, 0);

  const handleCheckout = async () => {
    if (!connected || !address || cart.length === 0) return;

    updateTransactionStatus('pending');
    try {
      // For cart checkout, we simulate sequential purchases or a batch purchase
      for (const agent of cart) {
        updateTransactionStatus('processing');
        const signature = await handlePurchase(
          wallet as any, // WalletContextState is compatible with BuyerWallet
          new PublicKey(agent.developer.walletAddress),
          agent.priceSOL
        );
        
        await TransactionsAPI.createPurchase(agent.id, signature, token!);
        addPurchased(agent);
      }
      
      updateTransactionStatus('success');
      setTimeout(() => {
        clearCart();
        updateTransactionStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Checkout failed:', error);
      updateTransactionStatus('idle');
    }
  };

  if (cart.length === 0 && transactionStatus !== 'success') {
    return (
      <div className="container mx-auto px-6 max-w-7xl py-24 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#18181b] border border-[#27272a] rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-8 h-8 text-[#71717a]" />
        </div>
        <h1 className="text-2xl font-medium text-white mb-2">Your cart is empty</h1>
        <p className="text-[#a1a1aa] mb-8 max-w-sm">
          Browse the directory to find the perfect AI agents for your infrastructure.
        </p>
        <Link href="/marketplace" className="px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-zinc-200 transition-colors">
          Browse Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 max-w-7xl py-12">
      <h1 className="text-3xl font-medium text-white mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {cart.map((agent) => (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 flex items-center gap-6"
              >
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-[#09090b] flex-shrink-0">
                  <Image src={agent.imageUrl || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80'} alt={agent.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium mb-1">{agent.name}</h3>
                  <p className="text-sm text-[#a1a1aa] line-clamp-1">{agent.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-medium mb-2">◎ {agent.priceSOL}</p>
                  <button
                    onClick={() => removeFromCart(agent.id)}
                    className="p-2 text-[#71717a] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-medium text-white mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Subtotal</span>
                <span className="text-white font-mono">◎ {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Network Fee</span>
                <span className="text-white font-mono">◎ 0.00025</span>
              </div>
              <div className="h-px bg-[#27272a]" />
              <div className="flex justify-between text-base font-medium">
                <span className="text-white">Total</span>
                <span className="text-white font-mono">◎ {(totalPrice + 0.00025).toFixed(5)}</span>
              </div>
            </div>

            {transactionStatus === 'success' ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-md p-4 text-center">
                <Check className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-emerald-400 font-medium">Purchase Successful</p>
                <Link href="/dashboard" className="text-xs text-emerald-500 underline mt-2 block">
                  Go to Library
                </Link>
              </div>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={transactionStatus !== 'idle' || !connected}
                className="w-full py-3 bg-white text-black rounded-md font-medium hover:bg-zinc-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {transactionStatus === 'idle' ? (
                  <>Checkout <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                )}
              </button>
            )}
            
            {!connected && (
              <p className="text-[10px] text-amber-400 text-center mt-4">
                Connect your wallet to proceed with checkout.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
