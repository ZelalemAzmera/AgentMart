# Changelog

All notable changes to the AgentMart project will be documented in this file.

## [Unreleased]

### Added
- **Motion SVG Background**: Integrated a sophisticated, animated geometric SVG (`AnimatedNetworkSVG`) built with Framer Motion into the landing page hero section.
- **Sidebar Layout**: Implemented a responsive `Sidebar` component for all application routes (Dashboard, Developer, Marketplace) wrapped inside a new `AppLayout` component.
- **ClientLayout Routing Wrapper**: Added logic to dynamically render a transparent `Navbar` without the sidebar on the landing page, while persisting the sidebar and sticky navigation on application pages.
- **Transaction Mocking**: Built a complete state-machine mock transaction flow (`txState`) using Zustand for simulating Solana Phantom wallet interactions (Idle → Waiting → Processing → Verifying → Success) to provide immediate UX feedback without blockchain delays.

### Changed
- **Aesthetic Overhaul**: Stripped out all "vibe-coded" UI patterns. Transitioned from heavy purple gradients and glowing effects to a strict, premium monochrome palette (`#09090b` background, `#18181b` surface elements, high-contrast `#ffffff` text).
- **Typography Standardization**: Normalized font sizes, line heights, and weights across the application. Removed ultra-thin body text and oversized headers.
- **Micro-interactions**: Replaced bouncy animations with a standardized, professional cubic-bezier easing curve (`cubic-bezier(0.16, 1, 0.3, 1)`). Hover effects on cards are now limited to subtle border color shifts and maximum `2%` scaling.
- **Copywriting Refinement**: Removed hype-focused language ("The App Store for AI") in favor of precise, engineering-oriented descriptions ("Decentralized infrastructure for distributing artificial intelligence agents").
- **Dependencies**: Removed heavy `@solana/wallet-adapter` and `web3.js` libraries in favor of a functional frontend-only architecture, eliminating long NPM installation times and Webpack polyfill issues on Windows.

### Removed
- **Solana Wallet Adapters**: Entirely removed dependency on heavy Web3 packages to prioritize functional frontend UX.
- **Glow Effects**: Removed `hover:shadow-glow` and arbitrary pulsing orb background elements.
