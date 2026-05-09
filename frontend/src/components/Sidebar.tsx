'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Search, Code2, Library, Settings, Activity } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const navLinks = [
  { name: 'Directory', href: '/marketplace', icon: Search },
  { name: 'My Library', href: '/dashboard', icon: Library },
  { name: 'Provider Portal', href: '/developer', icon: Code2 },
];

const bottomLinks = [
  { name: 'Network Status', href: '#', icon: Activity },
  { name: 'Settings', href: '#', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-full border-r border-[#27272a] bg-[#09090b] z-20">
      <div className="h-14 flex items-center px-6 border-b border-[#27272a]">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Box className="w-5 h-5 text-white" />
          <span className="text-sm font-medium tracking-tight text-white">AgentMart</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
        <div>
          <span className="px-2 text-xs font-medium text-[#71717a] uppercase tracking-wider mb-2 block">
            Platform
          </span>
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all relative group",
                    isActive ? "text-white" : "text-[#a1a1aa] hover:text-white hover:bg-[#18181b]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActive"
                      className="absolute inset-0 bg-[#27272a] rounded-md z-0"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-[#27272a]">
        <nav className="space-y-1">
          {bottomLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.name}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#71717a] hover:text-white hover:bg-[#18181b] transition-colors"
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{link.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
