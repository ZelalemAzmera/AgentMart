'use client';

export function Providers({ children }: { children: React.ReactNode }) {
  // Mock providers for now to avoid heavy solana dependencies and show the UI instantly
  return <>{children}</>;
}
