import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/AppLayout";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgentMart | Decentralized AI Infrastructure",
  description: "A decentralized infrastructure for distributing artificial intelligence agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${inter.className} min-h-full flex flex-col bg-[#09090b] text-white selection:bg-white/20`} suppressHydrationWarning>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
