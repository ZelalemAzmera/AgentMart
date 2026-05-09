'use client';

import Link from 'next/link';
import { Box } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#27272a] bg-[#09090b]">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 w-fit">
              <Box className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-white tracking-tight">AgentMart</span>
            </Link>
            <p className="text-[#a1a1aa] text-sm leading-relaxed max-w-sm">
              Decentralized infrastructure for distributing artificial intelligence agents. Built on Solana for verifiable, low-latency deployment.
            </p>
          </div>

          {/* Directory */}
          <div>
            <h4 className="text-sm font-medium text-white mb-6">Directory</h4>
            <ul className="space-y-4">
              {['All Agents', 'Image Analysis', 'Voice Synthesis', 'Code Generation', 'Data Processing'].map((item) => (
                <li key={item}>
                  <Link href="/marketplace" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-medium text-white mb-6">Resources</h4>
            <ul className="space-y-4">
              {['Documentation', 'Developer Portal', 'API Reference', 'Status', 'Terms of Service', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#27272a] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#71717a]">
            © {new Date().getFullYear()} AgentMart. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-[#71717a]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Operational on Devnet
          </div>
        </div>
      </div>
    </footer>
  );
}
