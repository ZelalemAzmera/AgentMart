'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Box, Layers, Plus, X,
  Activity, CheckCircle, ArrowLeft
} from 'lucide-react';
import { useWalletStore } from '@/lib/store';
import { DeveloperAPI } from '@/services/api/developer.api';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { handleListAgent } from '@/utils/handleListAgent';
import { useAuthStore } from '@/lib/store';

const mockStats = [
  { label: 'Total Volume', value: '◎ 8.45', icon: TrendingUp },
  { label: 'Total Distributions', value: '23', icon: Box },
  { label: 'Active Deployments', value: '4', icon: Layers },
];

const mockListings = [
  { id: '1', name: 'SlideAI', category: 'Productivity', price: 0.4, status: 'active', sales: 12 },
  { id: '3', name: 'LogoCraft', category: 'Image AI', price: 0.5, status: 'active', sales: 8 },
  { id: '5', name: 'AdCopy Pro', category: 'Marketing', price: 0.35, status: 'active', sales: 3 },
  { id: '7', name: 'TextSummarize', category: 'Productivity', price: 0.25, status: 'pending', sales: 0 },
];

const mockSales = [
  { agent: 'SlideAI', buyer: '7xKm...3qPz', amount: 0.4, time: '2 min ago', tx: 'abc123' },
  { agent: 'LogoCraft', buyer: 'BnRt...9wXv', amount: 0.5, time: '1 hr ago', tx: 'def456' },
  { agent: 'SlideAI', buyer: '4pQa...7mLc', amount: 0.4, time: '3 hrs ago', tx: 'ghi789' },
  { agent: 'AdCopy Pro', buyer: 'Jk2s...5nYr', amount: 0.35, time: '1 day ago', tx: 'jkl012' },
];

const statusBadge = (status: string) => {
  if (status === 'active')
    return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[10px] font-bold uppercase bg-[#18181b] border border-[#27272a] text-white tracking-wider"><span className="w-1 h-1 rounded-full bg-emerald-500"/> Active</span>;
  if (status === 'pending')
    return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[10px] font-bold uppercase bg-[#18181b] border border-[#27272a] text-white tracking-wider"><span className="w-1 h-1 rounded-full bg-amber-500"/> Validating</span>;
  return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[10px] font-bold uppercase bg-[#18181b] border border-[#27272a] text-white tracking-wider"><span className="w-1 h-1 rounded-full bg-red-500"/> Offline</span>;
};

const categories = [
  { label: 'Productivity', value: 'PRODUCTIVITY' },
  { label: 'Image AI', value: 'IMAGE' },
  { label: 'Voice AI', value: 'VOICE' },
  { label: 'Coding', value: 'CODE' },
  { label: 'Marketing', value: 'OTHER' },
];

interface FormData {
  name: string;
  description: string;
  category: string;
  priceSOL: string;
  demoUrl: string;
  imageUrl: string;
  shortDesc: string;
  agentUrl: string;
}

export default function DeveloperPage() {
  const { connected } = useWalletStore();
  const wallet = useWallet();
  const { token } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: '', description: '', shortDesc: '', category: 'PRODUCTIVITY', priceSOL: '', demoUrl: '', imageUrl: '', agentUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected || !wallet.publicKey || !token) return;

    try {
      setSubmitted(true);
      const price = parseFloat(form.priceSOL);
      
      const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || 'Gkh5t4pgh19DgdAogGdADhzKhYpDBQynUcHvWvL9A9Yz');
      
      await handleListAgent(
        wallet as any,
        form.name,
        form.description,
        price,
        PROGRAM_ID
      );

      await DeveloperAPI.createAgent({
        name: form.name,
        description: form.description,
        shortDesc: form.shortDesc,
        category: form.category,
        priceSOL: price,
        imageUrl: form.imageUrl,
        demoUrl: form.demoUrl,
        agentUrl: form.agentUrl,
      }, token);

      setTimeout(() => {
        setSubmitted(false);
        setShowModal(false);
        setForm({ name: '', description: '', shortDesc: '', category: 'PRODUCTIVITY', priceSOL: '', demoUrl: '', imageUrl: '', agentUrl: '' });
      }, 2000);
    } catch (err) {
      console.error('Listing failed:', err);
      setSubmitted(false);
      alert('Failed to list agent.');
    }
  };

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
            >
              <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-10 shadow-2xl">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest">Initialize System</h2>
                  <button onClick={() => setShowModal(false)} className="text-[#52525b] hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-12 h-12 border border-[#27272a] rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="text-white font-bold text-base uppercase tracking-widest mb-2">Network Queued</p>
                    <p className="text-[#52525b] text-xs">Deployment process initiated on the AgentMart protocol.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em] mb-2.5">Agent Name</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                          className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em] mb-2.5">Price (SOL)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={form.priceSOL}
                          onChange={(e) => setForm({ ...form, priceSOL: e.target.value })}
                          required
                          className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-all duration-200"
                        />
                      </div>
                    </div>

                    {[
                      { id: 'shortDesc', label: 'Short Description', type: 'text' },
                      { id: 'demoUrl', label: 'Demo Gateway URL', type: 'url' },
                      { id: 'imageUrl', label: 'Visual Asset Identifier', type: 'url' },
                      { id: 'agentUrl', label: 'Agent Access URL', type: 'url' },
                    ].map((field) => (
                      <div key={field.id}>
                        <label className="block text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em] mb-2.5">{field.label}</label>
                        <input
                          type={field.type}
                          value={form[field.id as keyof FormData]}
                          onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                          required
                          className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-all duration-200"
                        />
                      </div>
                    ))}

                    <div>
                      <label className="block text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em] mb-2.5">Architecture Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-white cursor-pointer transition-all duration-200"
                      >
                        {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em] mb-2.5">System Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        required
                        rows={3}
                        className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-all duration-200 resize-none"
                      />
                    </div>

                    <div className="pt-6 border-t border-[#27272a]">
                      <button
                        type="submit"
                        disabled={!connected}
                        className="w-full py-3.5 rounded-md bg-white text-black font-bold text-xs uppercase tracking-widest transition-all hover:bg-zinc-200 disabled:opacity-50 active:scale-[0.98]"
                      >
                        {connected ? 'Deploy System' : 'Connect to Deploy'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 max-w-7xl py-12 md:py-16">
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#52525b] hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Return to Home
        </Link>

        <div className="flex items-end justify-between mb-16">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Deployment</h1>
            <p className="text-[#71717a] mt-3 max-w-2xl text-base leading-relaxed">
              Provider node portal. Initialize new infrastructure agents and monitor distribution volume across the network.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-md bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-[0.97]"
          >
            <Plus className="w-4 h-4" /> Initialize System
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20">
          {mockStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#18181b] border border-[#27272a] rounded-lg p-8 group hover:border-[#3f3f46] transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Icon className="w-5 h-5 text-[#52525b] group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em] group-hover:text-[#71717a] transition-colors">{stat.label}</span>
                </div>
                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-8">Active Systems</h2>
            <div className="bg-[#18181b]/50 backdrop-blur-sm border border-[#27272a] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#27272a] bg-[#09090b]/50">
                      <th className="px-6 py-5 text-left text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em]">System Identifier</th>
                      <th className="px-6 py-5 text-left text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em]">Architecture</th>
                      <th className="px-6 py-5 text-left text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em]">Price Rate</th>
                      <th className="px-6 py-5 text-left text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em]">Volume</th>
                      <th className="px-6 py-5 text-left text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em]">Protocol Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272a] text-sm">
                    {mockListings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-5 font-bold text-white tracking-tight">{listing.name}</td>
                        <td className="px-6 py-5 text-[#71717a] font-medium">{listing.category}</td>
                        <td className="px-6 py-5 text-white font-mono">◎ {listing.price}</td>
                        <td className="px-6 py-5 text-[#52525b] font-medium">{listing.sales}</td>
                        <td className="px-6 py-5">{statusBadge(listing.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-8">Network Feed</h2>
            <div className="bg-[#18181b]/50 backdrop-blur-sm border border-[#27272a] rounded-lg overflow-hidden">
              <div className="divide-y divide-[#27272a]">
                {mockSales.map((sale, i) => (
                  <div key={i} className="px-6 py-6 group hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-sm font-bold text-white block mb-1 tracking-tight">{sale.agent}</span>
                        <span className="text-[10px] text-[#52525b] font-mono group-hover:text-[#71717a] transition-colors uppercase tracking-widest">{sale.buyer}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white block mb-1">+◎ {sale.amount}</span>
                        <span className="text-[10px] text-[#52525b] uppercase tracking-widest font-bold">{sale.time}</span>
                      </div>
                    </div>
                    <a
                      href={`https://explorer.solana.com/tx/${sale.tx}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#52525b] hover:text-white transition-all mt-3"
                    >
                      <Activity className="w-3.5 h-3.5" /> Explorer
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
