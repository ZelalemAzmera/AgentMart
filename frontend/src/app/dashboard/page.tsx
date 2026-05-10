'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLibraryStore } from '@/lib/store';
import { Activity, Library, ArrowUpRight, ArrowLeft } from 'lucide-react';

const MOCK_TX_BASE = 'mock5XyZ8bK3v1qL';

export default function DashboardPage() {
  const { purchased } = useLibraryStore();

  const displayAgents = purchased.length > 0 ? purchased : [];
  const purchaseHistory = purchased.map((agent, i) => ({
    agent,
    txSig: `${MOCK_TX_BASE}${agent.id}aB${i}cD`,
    date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
  }));

  return (
    <div className="container mx-auto px-6 max-w-7xl py-12 md:py-16">
      
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#52525b] hover:text-white transition-colors mb-12 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Return to Home
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight">Library</h1>
        <p className="text-[#71717a] mt-3 max-w-2xl text-base leading-relaxed">
          Manage your acquired agents and deployment configurations. View verified purchase logs and network signatures.
        </p>
      </div>

      {displayAgents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-32 border border-[#27272a] bg-[#18181b]/50 rounded-lg border-dashed"
        >
          <Library className="w-8 h-8 text-[#27272a] mb-6" />
          <h2 className="text-xl font-bold text-white mb-2">No active deployments</h2>
          <p className="text-[#52525b] text-sm mb-8 max-w-xs text-center">
            You haven't acquired any agents yet. Provision agents from the directory to build your workflows.
          </p>
          <Link
            href="/marketplace"
            className="px-8 py-3 bg-white text-black rounded-md font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors shadow-lg"
          >
            Browse Directory
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {displayAgents.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden group hover:border-[#3f3f46] transition-all duration-300 shadow-sm"
              >
                <div className="relative w-full aspect-video border-b border-[#27272a] bg-[#09090b]">
                  <Image
                    src={agent.imageUrl || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80'}
                    alt={agent.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-[4px] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                    {agent.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white text-base mb-1 tracking-tight">{agent.name}</h3>
                  <p className="text-sm text-[#52525b] group-hover:text-[#71717a] transition-colors mb-6 line-clamp-2 h-10">{agent.description}</p>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => window.open(agent.demoUrl, '_blank')}
                      className="flex-1 py-2.5 rounded-md bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      Initialize <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/agents/${agent.slug}`}
                      className="px-4 py-2.5 rounded-md border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-[#71717a] hover:text-white text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Config
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-5 h-5 text-[#71717a]" />
              <h2 className="text-lg font-bold text-white uppercase tracking-widest">Transaction Log</h2>
            </div>
            <div className="border border-[#27272a] bg-[#18181b]/50 backdrop-blur-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#27272a] bg-[#09090b]/50">
                      <th className="px-6 py-5 text-left text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em]">Asset Identifier</th>
                      <th className="px-6 py-5 text-left text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em]">Amount</th>
                      <th className="px-6 py-5 text-left text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em]">Timestamp</th>
                      <th className="px-6 py-5 text-left text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em]">Network Signature</th>
                      <th className="px-6 py-5 text-left text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em]">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272a]">
                    {purchaseHistory.map((row) => (
                      <tr key={row.agent.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-5 font-bold text-white tracking-tight">{row.agent.name}</td>
                        <td className="px-6 py-5 text-white font-mono">◎ {row.agent.priceSOL}</td>
                        <td className="px-6 py-5 text-[#71717a] font-medium">{row.date}</td>
                        <td className="px-6 py-5 text-[#52525b] font-mono">
                          {row.txSig.slice(0, 16)}...
                        </td>
                        <td className="px-6 py-5">
                          <a
                            href={`https://explorer.solana.com/tx/${row.txSig}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#71717a] hover:text-white font-bold text-[10px] uppercase tracking-widest transition-all"
                          >
                            Explorer <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
