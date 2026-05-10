'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Activity, Check, Loader2, Star,
  ShieldCheck, ArrowUpRight, Play, Copy, CheckCircle
} from 'lucide-react';
import { MarketplaceAPI } from '@/services/api/marketplace.api';
import { TransactionsAPI } from '@/services/api/transactions.api';
import { useWalletStore, useLibraryStore, useAuthStore } from '@/lib/store';
import { ConnectWalletModal } from '@/components/ConnectWalletModal';
import type { Agent } from '@/types';

const features = [
  'Unlimited generations per month',
  'Commercial license included',
  'API access with rate limits',
  'Priority queue processing',
  'Export in all standard formats',
  'Lifetime updates',
];

const mockReviews = [
  {
    id: 1,
    user: "0xA1b...4f9E",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
    rating: 5,
    date: "2 days ago",
    comment: "Incredible agent! The speed and accuracy are unmatched. Saved me hours of manual work."
  },
  {
    id: 2,
    user: "0x3C4...9b1A",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80",
    rating: 5,
    date: "1 week ago",
    comment: "Clean API, easy integration, and the deterministic outputs are exactly what I needed for my dApp."
  },
  {
    id: 3,
    user: "0x8F2...e7B2",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 4,
    date: "2 weeks ago",
    comment: "Works perfectly for the most part. Occasional latency spikes during high network congestion, but overall fantastic."
  }
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
  const { token } = useAuthStore();
  const { purchased, addPurchased } = useLibraryStore();

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [txSignature, setTxSignature] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchAgent = async () => {
      setLoading(true);
      const data = await MarketplaceAPI.getAgentBySlug(slug);
      setAgent(data);
      setLoading(false);
    };
    fetchAgent();
  }, [slug]);

  if (!loading && !agent) notFound();

  const isOwned = mounted && purchased.some((p) => p.id === agent?.id);

  const handleCopy = () => {
    if (!agent || !agent.developer?.walletAddress) return;
    navigator.clipboard.writeText(agent.developer.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !agent || !txSignature) return;

    setVerifying(true);
    try {
      // In a real implementation, this hits the TransactionsAPI.verifyPurchase endpoint
      await TransactionsAPI.createPurchase(agent.id, txSignature, token);
      
      setVerifySuccess(true);
      addPurchased(agent);
      
    } catch (error: any) {
      console.error('Verification failed:', error);
      alert(error.message || 'Verification failed. Please check the signature and try again.');
    } finally {
      setVerifying(false);
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
      <ConnectWalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDemoModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-[#09090b] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[85vh]"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#27272a] bg-[#18181b]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-white tracking-widest uppercase">Live Demo Preview</h3>
                </div>
                <div className="flex items-center gap-4">
                  <a href={agent.demoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#71717a] hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors">
                    Open Full <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <button onClick={() => setShowDemoModal(false)} className="text-[#71717a] hover:text-white transition-colors">
                    <Check className="w-5 h-5 rotate-45" />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-black relative">
                {agent.demoUrl ? (
                  <iframe src={agent.demoUrl} className="w-full h-full border-none" allow="camera; microphone; display-capture; autoplay; clipboard-write; encrypted-media" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[#52525b]">
                    <Activity className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-xs">No demo URL provided</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 max-w-7xl py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em] mb-8">
          <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
          <span className="text-[#27272a]">/</span>
          <span className="text-[#a1a1aa]">{agent.category}</span>
          <span className="text-[#27272a]">/</span>
          <span className="text-white">{agent.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* ── Left: Content ─────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 min-w-0">
            {/* Header & Main Image */}
            <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden bg-[#09090b] border border-[#27272a] mb-8 group">
              <Image
                src={agent.imageUrl || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80'}
                alt={agent.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
                  {agent.name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-md border border-white/20 text-[10px] font-bold text-white uppercase tracking-widest shadow-lg">
                    #{agent.category?.toLowerCase() || 'other'}
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-md border border-white/20 text-[10px] font-bold text-white uppercase tracking-widest shadow-lg">
                    #solana
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-md border border-white/20 text-[10px] font-bold text-white uppercase tracking-widest shadow-lg">
                    #ai-agent
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-5 flex flex-col">
                <span className="text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em] mb-1">Total Sales</span>
                <span className="text-2xl font-black text-white">{agent.totalSales || 0}</span>
              </div>
              <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-5 flex flex-col">
                <span className="text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em] mb-1">Price</span>
                <span className="text-2xl font-black text-emerald-400">◎ {agent.priceSOL}</span>
              </div>
              <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-5 flex flex-col">
                <span className="text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em] mb-1">Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bold text-white uppercase tracking-widest">Active</span>
                </div>
              </div>
            </div>

            {/* Try Before You Buy */}
            <div className="bg-gradient-to-br from-[#18181b] to-[#09090b] border border-[#27272a] rounded-xl p-8 mb-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight mb-2 flex items-center gap-2">
                    <Play className="w-5 h-5 text-white" fill="currentColor" /> Try Before You Buy
                  </h2>
                  <p className="text-[#a1a1aa] text-sm max-w-md">Launch the interactive preview container to test this agent's capabilities in a sandboxed environment.</p>
                </div>
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                >
                  Launch Demo
                </button>
              </div>
            </div>

            {/* Description & Features Unified */}
            <div className="space-y-12">
              <div>
                <h3 className="text-[11px] font-black text-[#52525b] uppercase tracking-[0.3em] mb-6 pb-4 border-b border-[#27272a]">About this Agent</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-[#d4d4d8] leading-loose text-base mb-6">
                    <strong className="text-white font-bold">{agent.name}</strong> is a high-performance infrastructure agent designed for seamless integration into modern workflows. 
                    {agent.description}
                  </p>
                  <p className="text-[#a1a1aa] leading-relaxed text-sm">
                    Built natively on the Solana network, this agent utilizes advanced deterministic processing to ensure reliable, high-speed execution with minimal latency overhead.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-black text-[#52525b] uppercase tracking-[0.3em] mb-6 pb-4 border-b border-[#27272a]">Included Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feat) => (
                    <div key={feat} className="flex items-center gap-3 bg-[#18181b] border border-[#27272a] p-4 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-[#d4d4d8] text-sm font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews & Ratings Section */}
              <div>
                <h3 className="text-[11px] font-black text-[#52525b] uppercase tracking-[0.3em] mb-6 pb-4 border-b border-[#27272a]">Ratings & Reviews</h3>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex flex-col items-center justify-center bg-[#18181b] border border-[#27272a] rounded-xl p-6 min-w-[140px]">
                    <span className="text-4xl font-black text-white mb-1">4.8</span>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-emerald-400 fill-emerald-400' : i === 5 ? 'text-emerald-400/50 fill-emerald-400/50' : 'text-[#27272a]'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-[#52525b] uppercase tracking-widest">128 Reviews</span>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star, idx) => {
                      const percentages = [85, 10, 5, 0, 0];
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#a1a1aa] w-2">{star}</span>
                          <div className="flex-1 h-1.5 bg-[#18181b] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentages[idx]}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="bg-[#18181b] border border-[#27272a] rounded-lg p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#27272a]">
                            <Image src={review.avatar} alt="User" fill className="object-cover" sizes="32px" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{review.user}</span>
                            <span className="text-[10px] text-[#52525b]">{review.date}</span>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-emerald-400 fill-emerald-400' : 'text-[#27272a]'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#a1a1aa] text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Base44 Payment Panel ──────────────── */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="sticky top-24 bg-[#09090b] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl">
              
              {/* Creator Info Header */}
              <div className="p-6 border-b border-[#27272a] bg-[#18181b]">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#27272a] border-2 border-[#3f3f46]">
                    <Image
                      src={agent.developer?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'}
                      alt="Creator"
                      fill className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em] block mb-0.5">Created by</span>
                    <span className="text-sm font-bold text-white">
                      {agent.developer?.displayName || (agent.developer?.walletAddress ? `${agent.developer.walletAddress.slice(0, 4)}...${agent.developer.walletAddress.slice(-4)}` : 'Unknown Creator')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {isOwned || verifySuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Access Granted</h2>
                    <p className="text-[#71717a] text-sm mb-8">You have full access to this agent.</p>
                    <a
                      href={agent.agentUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 px-6 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                      Open Agent <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl font-black text-white tracking-tight mb-2">Purchase License</h2>
                      <p className="text-[#71717a] text-sm leading-relaxed">Follow the steps below to securely acquire this agent license directly from the creator.</p>
                    </div>

                    <div className="space-y-8 relative">
                      {/* Step 1 */}
                      <div className="relative z-10 flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">1</div>
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1">Send Payment</h4>
                          <p className="text-xs text-[#71717a] mb-3">Send exactly <strong className="text-white">◎ {agent.priceSOL}</strong> to the creator's wallet address.</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-[#18181b] border border-[#27272a] rounded px-3 py-2 text-[11px] text-[#a1a1aa] font-mono truncate">
                              {agent.developer?.walletAddress || 'No Wallet Address Provided'}
                            </code>
                            <button
                              onClick={handleCopy}
                              className="p-2.5 bg-[#18181b] border border-[#27272a] rounded hover:border-[#3f3f46] hover:text-white text-[#71717a] transition-all"
                            >
                              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Line connecting steps */}
                      <div className="absolute top-8 left-4 bottom-8 w-px bg-[#27272a] -z-0" />

                      {/* Step 2 */}
                      <div className="relative z-10 flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">2</div>
                        <div className="w-full">
                          <h4 className="text-sm font-bold text-white mb-1">Verify Purchase</h4>
                          <p className="text-xs text-[#71717a] mb-4">Paste the transaction signature (TXID) from your wallet to verify the payment.</p>
                          
                          {!mounted || !connected || !token ? (
                            <button
                              onClick={() => setShowWalletModal(true)}
                              className="w-full py-3 bg-[#18181b] border border-[#27272a] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:border-white/20 transition-all"
                            >
                              Connect Wallet to Verify
                            </button>
                          ) : (
                            <form onSubmit={handleVerify} className="space-y-3">
                              <input
                                type="text"
                                placeholder="Signature (e.g. 5xRq...)"
                                value={txSignature}
                                onChange={(e) => setTxSignature(e.target.value)}
                                className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-3 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-emerald-500/50 transition-colors"
                                required
                              />
                              <button
                                type="submit"
                                disabled={verifying || !txSignature}
                                className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                              >
                                {verifying ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying
                                  </span>
                                ) : (
                                  'Verify My Purchase'
                                )}
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#27272a] flex items-center gap-3 justify-center text-[#52525b]">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Secure Escrow Validation</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
