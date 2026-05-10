'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, ShoppingCart, Wallet } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useWalletStore, useCartStore } from '@/lib/store';
import { WalletService } from '@/services/wallet/wallet.service';
import { ConnectWalletModal } from '@/components/ConnectWalletModal';

export function Navbar({ isTransparent = false }: { isTransparent?: boolean }) {
  const pathname = usePathname();
  const { connected, address, connect, disconnect } = useWalletStore();
  const { cart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleConnect = async () => {
    if (connected) {
      await WalletService.disconnectWallet();
      disconnect();
    } else {
      setIsModalOpen(true);
    }
  };

  const navLinks = [
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Library', href: '/dashboard' },
    { name: 'Deployment', href: '/developer' },
  ];

  return (
    <>
      <header 
        className={clsx(
          "w-full z-50 transition-all duration-300",
          isTransparent 
            ? "bg-transparent absolute top-0 left-0" 
            : "bg-[#09090b]/80 backdrop-blur-md border-b border-[#27272a] sticky top-0"
        )}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
          
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <Box className="w-6 h-6 text-white" />
              <span className="text-sm font-semibold tracking-tight text-white uppercase">AgentMart</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={clsx(
                    "text-xs uppercase tracking-widest px-4 py-2 rounded-md transition-all duration-200",
                    isActive 
                      ? "text-white font-semibold bg-white/5" 
                      : isTransparent 
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-[#71717a] hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {mounted && (
              <>
                <Link 
                  href="/cart" 
                  className={clsx(
                    "relative p-2 transition-colors duration-200",
                    isTransparent ? "text-white/70 hover:text-white" : "text-[#71717a] hover:text-white"
                  )}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
                
                <div className={clsx(
                  "h-4 w-px mx-1 hidden sm:block",
                  isTransparent ? "bg-white/10" : "bg-[#27272a]"
                )} />

                <button
                  onClick={handleToggleConnect}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 text-xs font-semibold uppercase tracking-wider",
                    connected 
                      ? "bg-black/20 backdrop-blur-md border border-white/10 text-white hover:border-white/20" 
                      : "bg-white text-black hover:bg-zinc-200"
                  )}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  {connected ? address?.slice(0, 4) + '...' + address?.slice(-4) : 'Connect'}
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <ConnectWalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
