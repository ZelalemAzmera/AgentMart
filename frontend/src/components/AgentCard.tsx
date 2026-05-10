'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Agent } from '@/types';
import { useWalletStore, useCartStore } from '@/lib/store';
import { useState } from 'react';
import { ConnectWalletModal } from './ConnectWalletModal';
import { ExternalLink, ShoppingCart } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  index?: number;
}

export function AgentCard({ agent, index = 0 }: AgentCardProps) {
  const { connected } = useWalletStore();
  const { addToCart } = useCartStore();
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!connected) {
      setShowModal(true);
    } else {
      addToCart(agent);
    }
  };

  const handleDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (agent.demoUrl) {
      window.open(agent.demoUrl, '_blank');
    }
  };

  return (
    <>
      <ConnectWalletModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
        className="group relative bg-[#18181b] rounded-lg border border-[#27272a] overflow-hidden hover:border-[#3f3f46] hover:shadow-2xl hover:shadow-black/50 transition-all duration-300"
      >
        <Link href={`/agents/${agent.slug}`}>
          {/* Thumbnail */}
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#09090b]">
            <Image
              src={agent.imageUrl || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80'}
              alt={agent.name}
              fill
              className="object-cover transition-transform duration-700 ease-custom group-hover:scale-[1.03] opacity-90 group-hover:opacity-100"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#18181b]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {agent.totalSales && agent.totalSales > 10 ? (
                <span className="px-2.5 py-1 bg-amber-500/90 backdrop-blur-md rounded-[4px] border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white shadow-lg flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Popular
                </span>
              ) : null}
              <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-[4px] border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white shadow-lg">
                {agent.category}
              </span>
            </div>

            {/* Base44 style Demo Overlay Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <button
                onClick={(e) => { e.preventDefault(); handleDemo(e); }}
                className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 active:scale-95 transition-all duration-200 shadow-xl shadow-black/50"
              >
                ▶ Demo
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-semibold text-white text-base tracking-tight truncate group-hover:text-white transition-colors">
                {agent.name}
              </h3>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-[4px] border border-white/5">
                <span className="text-white font-bold text-xs">
                  ◎ {agent.priceSOL}
                </span>
              </div>
            </div>
            
            <p className="text-[#71717a] text-sm leading-relaxed line-clamp-2 mb-6 h-10 group-hover:text-[#a1a1aa] transition-colors">
              {agent.description}
            </p>

            <div className="flex items-center justify-between pt-5 border-t border-[#27272a]">
              {/* Creator */}
              <div className="flex items-center gap-2.5">
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-[#27272a] border border-white/10">
                  <Image
                    src={agent.developer?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'}
                    alt={agent.developer?.displayName || 'Creator'}
                    fill
                    className="object-cover"
                    sizes="24px"
                  />
                </div>
                <span className="text-[11px] font-medium text-[#52525b] group-hover:text-[#71717a] transition-colors">
                  {agent.developer?.displayName || (agent.developer?.walletAddress ? `${agent.developer.walletAddress.slice(0, 4)}...${agent.developer.walletAddress.slice(-4)}` : 'Unknown')}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col text-right">
                  <span className="text-[9px] uppercase tracking-widest text-[#52525b] font-bold">Sales</span>
                  <span className="text-xs font-bold text-white">{agent.totalSales || 0}</span>
                </div>
                <div className="h-6 w-px bg-[#27272a]" />
                <button
                  className="text-xs font-bold text-white hover:text-emerald-400 transition-colors uppercase tracking-wider flex items-center gap-1"
                >
                  View Details <span className="text-base leading-none">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </>
  );
}
