'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, LayoutGrid, Filter, ArrowLeft } from 'lucide-react';
import { AgentCard } from '@/components/AgentCard';
import { categories } from '@/data/mock';
import { MarketplaceAPI } from '@/services/api/marketplace.api';
import { useMarketplaceStore } from '@/lib/store';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const sortOptions = ['Relevance', 'Newest', 'Price: Low to High', 'Price: High to Low'];

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const { agents, setAgents } = useMarketplaceStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('Relevance');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const data = await MarketplaceAPI.getAgents();
        setAgents(data.agents || []);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, [setAgents]);
  const filtered = useMemo(() => {
    let results = [...agents];

    if (search) {
      results = results.filter(
        (a) =>
          (a.name && a.name.toLowerCase().includes(search.toLowerCase())) ||
          (a.description && a.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All') {
      results = results.filter((a) => a.category === selectedCategory);
    }

    if (sortBy === 'Price: Low to High') results.sort((a, b) => a.priceSOL - b.priceSOL);
    else if (sortBy === 'Price: High to Low') results.sort((a, b) => b.priceSOL - a.priceSOL);
    
    return results;
  }, [agents, search, selectedCategory, sortBy]);

  return (
    <div className="container mx-auto px-6 max-w-7xl py-12 md:py-16">
      
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#52525b] hover:text-white transition-colors mb-12 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Return to Home
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Mini Sidebar for Categories */}
        <aside className="w-full lg:w-48 flex-shrink-0">
          <div className="sticky top-28 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-6 lg:mb-8">
                <Filter className="w-4 h-4 text-[#71717a]" />
                <h3 className="text-[10px] font-bold text-[#71717a] uppercase tracking-[0.2em]">Filter</h3>
              </div>
              <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
                {['All', ...categories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={clsx(
                      "whitespace-nowrap lg:w-full text-left px-4 py-2.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all duration-200",
                      selectedCategory === cat 
                        ? "bg-white text-black shadow-lg" 
                        : "text-[#52525b] hover:text-white hover:bg-white/5"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="hidden lg:block h-px bg-[#18181b]" />
            
            <div className="hidden lg:block">
              <div className="flex items-center gap-2 mb-4">
                <LayoutGrid className="w-4 h-4 text-[#71717a]" />
                <h3 className="text-[10px] font-bold text-[#71717a] uppercase tracking-[0.2em]">Stats</h3>
              </div>
              <p className="text-[11px] text-[#52525b] leading-relaxed">
                Found <span className="text-white font-bold">{filtered.length}</span> agents active on Devnet.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-10 lg:mb-12">
            <h1 className="text-4xl font-bold text-white tracking-tight mb-3">Agent Directory</h1>
            <p className="text-[#71717a] text-base leading-relaxed max-w-2xl">
              Verified autonomous agents and specialized infrastructure for the machine-learning layer of the AgentMart protocol.
            </p>
          </div>

          {/* Control Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 lg:mb-12">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b] group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search index..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#18181b] border border-[#27272a] rounded-md pl-11 pr-4 py-3 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#3f3f46] focus:bg-[#1c1c1f] transition-all duration-200"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="relative min-w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-[#18181b] border border-[#27272a] rounded-md px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#71717a] focus:outline-none focus:border-[#3f3f46] cursor-pointer transition-all hover:text-white"
              >
                {sortOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b] pointer-events-none" />
            </div>
          </div>

          {/* Agent Grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-[#18181b] border border-[#27272a] rounded-lg aspect-[4/5] animate-pulse" />
                ))}
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-40 border border-[#27272a] bg-[#18181b]/30 rounded-lg border-dashed"
              >
                <Search className="w-10 h-10 text-[#27272a] mb-6" />
                <h2 className="text-xl font-bold text-white mb-2">Null result</h2>
                <p className="text-sm text-[#52525b] max-w-xs text-center">
                  Try adjusting your search query or selecting a different infrastructure category.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filtered.map((agent, i) => (
                  <AgentCard key={agent.id} agent={agent} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-6 py-24 flex justify-center">
        <div className="w-8 h-8 border-2 border-white/5 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
