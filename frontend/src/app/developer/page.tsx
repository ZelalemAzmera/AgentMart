'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, UploadCloud, Link as LinkIcon, Image as ImageIcon, DollarSign, Activity, CheckCircle, Loader2 } from 'lucide-react';
import { useWalletStore, useAuthStore } from '@/lib/store';
import { DeveloperAPI } from '@/services/api/developer.api';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectWalletModal } from '@/components/ConnectWalletModal';

const categories = [
  { label: 'Productivity', value: 'PRODUCTIVITY' },
  { label: 'Image AI', value: 'IMAGE' },
  { label: 'Voice AI', value: 'VOICE' },
  { label: 'Coding', value: 'CODE' },
  { label: 'Marketing', value: 'OTHER' },
];

export default function DeveloperPage() {
  const { connected } = useWalletStore();
  const wallet = useWallet();
  const { token } = useAuthStore();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    name: '',
    shortDesc: '',
    description: '',
    category: 'PRODUCTIVITY',
    priceSOL: '',
    demoUrl: '',
    imageUrl: '',
    agentUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !token) {
      setShowWalletModal(true);
      return;
    }

    setSubmitting(true);
    try {
      const price = parseFloat(form.priceSOL);
      
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

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', description: '', shortDesc: '', category: 'PRODUCTIVITY', priceSOL: '', demoUrl: '', imageUrl: '', agentUrl: '' });
      }, 4000);
    } catch (err) {
      console.error('Listing failed:', err);
      alert('Failed to list agent. Please ensure all fields are correct.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all duration-200 placeholder-[#52525b]";
  const labelClass = "block text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em] mb-2.5 ml-1";

  return (
    <>
      <ConnectWalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />

      <div className="container mx-auto px-6 max-w-4xl py-12 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#52525b] hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Return to Hub
        </Link>

        <div className="mb-12 border-b border-[#27272a] pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">List Your Agent</h1>
          <p className="text-[#71717a] text-lg max-w-2xl">Publish your AI agent to the decentralized marketplace. Set your price, provide a demo, and start earning Solana.</p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-24 text-center border border-[#27272a] rounded-xl bg-[#18181b] shadow-2xl"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-3 tracking-tight">System Deployed</h2>
              <p className="text-[#71717a] text-base mb-8 max-w-md mx-auto">Your AI agent has been successfully listed on the marketplace protocol.</p>
              <Link
                href="/marketplace"
                className="inline-flex px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-colors"
              >
                View in Marketplace
              </Link>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-10"
            >
              {/* Basic Info Section */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Activity className="w-5 h-5 text-[#71717a]" /> Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className={labelClass}>Agent Name</label>
                    <input
                      type="text"
                      placeholder="e.g. ImageCraft Pro"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Architecture Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className={inputClass + " cursor-pointer appearance-none"}
                    >
                      {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className={labelClass}>Short Tagline</label>
                  <input
                    type="text"
                    placeholder="Brief 1-sentence summary of what it does"
                    value={form.shortDesc}
                    onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Full Description</label>
                  <textarea
                    placeholder="Detailed explanation of features, capabilities, and technical specs..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                    rows={5}
                    className={inputClass + " resize-none"}
                  />
                </div>
              </div>

              {/* Media & Links Section */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <LinkIcon className="w-5 h-5 text-[#71717a]" /> Assets & Links
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Visual Asset URL (Thumbnail)</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b]" />
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                        required
                        className={inputClass + " pl-11"}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Demo Gateway URL (iFrame compatible)</label>
                    <div className="relative">
                      <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b]" />
                      <input
                        type="url"
                        placeholder="https://your-demo-site.com"
                        value={form.demoUrl}
                        onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                        required
                        className={inputClass + " pl-11"}
                      />
                    </div>
                    <p className="text-[11px] text-[#52525b] mt-2 ml-1">This will be embedded in the "Try Before You Buy" modal.</p>
                  </div>

                  <div>
                    <label className={labelClass}>Private Access URL (Delivery)</label>
                    <div className="relative">
                      <UploadCloud className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b]" />
                      <input
                        type="url"
                        placeholder="https://private-api.com or Download Link"
                        value={form.agentUrl}
                        onChange={(e) => setForm({ ...form, agentUrl: e.target.value })}
                        required
                        className={inputClass + " pl-11"}
                      />
                    </div>
                    <p className="text-[11px] text-[#52525b] mt-2 ml-1">This is ONLY revealed to buyers after successful purchase verification.</p>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#71717a]" /> Pricing Strategy
                </h2>

                <div>
                  <label className={labelClass}>Price in SOL</label>
                  <div className="relative max-w-sm">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-white">◎</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.50"
                      value={form.priceSOL}
                      onChange={(e) => setForm({ ...form, priceSOL: e.target.value })}
                      required
                      className={inputClass + " pl-10 text-lg font-bold"}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl shadow-white/10"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Initializing Protocol...
                  </span>
                ) : (mounted && connected) ? (
                  'List Agent on Marketplace'
                ) : (
                  'Connect Wallet to List'
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
