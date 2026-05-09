'use client';

import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { usePathname } from 'next/navigation';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      <Navbar isTransparent={isLandingPage} />
      <main className="flex-1 flex flex-col relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
