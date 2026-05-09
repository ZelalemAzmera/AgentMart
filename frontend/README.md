# AgentMart

A sophisticated, decentralized infrastructure frontend for the distribution and monetization of artificial intelligence agents.

## Architecture

This project is currently built as a **frontend-only** application using **Next.js 16 (App Router)** and **Tailwind CSS**. It relies heavily on **Framer Motion** for precise, easing-curve-based micro-interactions and **Zustand** for global state management (specifically for mocking wallet connections and asset tracking).

### Core Features

- **Dynamic Layout Routing**: A clean architecture that displays a full-screen landing page at the root (`/`), and seamlessly transitions into a dashboard layout (with a persistent sidebar) for all application sub-routes (`/marketplace`, `/developer`, `/dashboard`).
- **State-Machine Mocking**: Robust simulation of complex asynchronous tasks. Purchasing an agent triggers an automated UI state machine (`Idle → Waiting → Processing → Verifying → Success`) mimicking a real blockchain transaction.
- **Premium Monochrome Aesthetic**: A highly professional, stripped-down visual design focused on content and usability, completely avoiding "vibe-coded" tropes (no excessive gradients, sparkles, or oversized typography).
- **Motion SVG Framework**: The landing page features an intricate, data-driven SVG animation built with Framer Motion, conceptually representing a distributed peer-to-peer network.

## Getting Started

Because the heavy Solana Web3 dependencies have been removed in favor of a mocked, purely functional frontend, installation is practically instantaneous.

### Prerequisites
- Node.js 18+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) (or the assigned port, usually `3002` if others are running) with your browser to see the result.

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
