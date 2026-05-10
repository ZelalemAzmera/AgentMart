'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Activity, Check, Loader2,
  ShieldCheck, ArrowUpRight
} from 'lucide-react';
import { MarketplaceAPI } from '@/services/api/marketplace.api';
import { TransactionsAPI } from '@/services/api/transactions.api';
import { useWalletStore, useLibraryStore, useTransactionStore, useCartStore, useAuthStore } from '@/lib/store';
import { ConnectWalletModal } from '@/components/ConnectWalletModal';
import type { Agent } from '@/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { handlePurchase } from '@/utils/handlePurchase';

const txLabels: Record<string, string> = {
  idle:       '',
  pending:    'Awaiting confirmation...',
  processing: 'Processing transaction...',
  confirmed:  'Verifying signature...',
  success:    'Access granted',
};

const features = [
  'Unlimited generations per month',
  'Commercial license included',
  'API access with rate limits',
  'Priority queue processing',
  'Export in all standard formats',
  'Lifetime updates',
];

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  const { connected } = useWalletStore();
  const wallet = useWallet();
  const { token } = useAuthStore();
  const { purchased, addPurchased } = useLibraryStore();
  const { transactionStatus, updateTransactionStatus } = useTransactionStore();
  const { addToCart } = useCartStore();

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'features'>('description');

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);
      const data = await MarketplaceAPI.getAgentBySlug(slug);
      setAgent(data);
      setLoading(false);
    };
    fetchAgent();
  }, [slug]);

  if (!loading && !agent) notFound();

  const isOwned = purchased.some((p) => p.id === agent?.id);

  const handleBuy = async () => {
    if (!wallet.connected || !wallet.publicKey || !token) { setShowModal(true); return; }
    if (!agent || isOwned || transactionStatus !== 'idle') return;

    updateTransactionStatus('pending');
    try {
      updateTransactionStatus('processing');
      const signature = await handlePurchase(
        wallet as any,
        new PublicKey(agent.developer.walletAddress),
        agent.priceSOL
      );
      
      updateTransactionStatus('confirmed');
      await TransactionsAPI.createPurchase(agent.id, signature, token);
      
      updateTransactionStatus('success');
      addPurchased(agent);
      
      setTimeout(() => updateTransactionStatus('idle'), 3000);
    } catch (error) {
      console.error('Purchase failed:', error);
      updateTransactionStatus('idle');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#a1a1aa]" />
      </div>
    );
  }

  if (!agent) return null;

  return (
    <>
      <ConnectWalletModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <div className="container mx-auto px-6 max-w-7xl py-12">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Directory
        </Link>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* ── Left: Preview ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-0"
          >
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#09090b] border border-[#27272a] mb-8">
              <Image
                src={agent.imageUrl || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80'}
                alt={agent.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>

            <div className="flex border-b border-[#27272a] mb-8">
              {(['description', 'features'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium capitalize transition-colors relative ${
                    activeTab === tab ? 'text-white' : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-white" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                {activeTab === 'description' ? (
                  <motion.div key="desc" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                    <p className="text-[#a1a1aa] leading-relaxed text-base">
                      <strong className="text-white font-medium">{agent.name}</strong> is a high-performance AI agent
                      designed for operational efficiency. Utilizing state-of-the-art language models, it automates
                      complex workflows.
                    </p>
                    <p className="text-[#a1a1aa] leading-relaxed text-base">{agent.description}</p>
                  </motion.div>
                ) : (
                  <motion.ul key="features" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {features.map((feat) => (
                      <li key={feat} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-white" />
                        <span className="text-[#a1a1aa] text-base">{feat}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Right: Purchase Panel ──────────────── */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="sticky top-24 border border-[#27272a] bg-[#18181b] rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-2.5 py-1 bg-[#27272a] rounded-[4px] text-xs font-medium text-white uppercase tracking-wider">
                    {agent.category}
                  </span>
                </div>

                <h1 className="text-2xl font-medium text-white mb-2">{agent.name}</h1>
                
                <div className="flex items-center gap-3 mb-8 pb-8 border-b border-[#27272a]">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#27272a]">
                    <Image
                      src={agent.developer.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'}
                      alt={agent.developer.displayName || agent.developer.walletAddress}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-[#71717a] mb-0.5">Developed by</p>
                    <p className="text-sm font-medium text-white">
                      {agent.developer.displayName || `${agent.developer.walletAddress.slice(0, 4)}...${agent.developer.walletAddress.slice(-4)}`}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-medium text-white">◎ {agent.priceSOL}</span>
                    <span className="text-sm text-[#71717a]">SOL</span>
                  </div>
                  <p className="text-xs text-[#a1a1aa]">Perpetual license</p>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {transactionStatus !== 'idle' && transactionStatus !== 'success' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-3 bg-[#27272a] rounded-md px-4 py-3">
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                        <span className="text-sm text-white">{txLabels[transactionStatus]}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isOwned ? (
                    <button
                      onClick={() => window.open(agent.demoUrl, '_blank')}
                      className="w-full py-3 rounded-md bg-white text-black font-medium text-sm transition-colors hover:bg-zinc-200 flex items-center justify-center gap-2"
                    >
                      Access Application <ArrowUpRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleBuy}
                        disabled={transactionStatus !== 'idle'}
                        className="w-full py-3 rounded-md bg-white text-black font-medium text-sm transition-colors hover:bg-zinc-200 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {transactionStatus === 'idle' ? 'Purchase License' : 'Processing...'}
                      </button>
                      <button
                        onClick={() => addToCart(agent)}
                        className="w-full py-3 rounded-md border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-white font-medium text-sm transition-colors"
                      >
                        Add to Cart
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-[#09090b] border-t border-[#27272a] flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                  <ShieldCheck className="w-4 h-4 text-white" /> Network Verified
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
