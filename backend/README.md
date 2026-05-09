# AgentMart Backend API
AI Agent Marketplace built for the Dev3pack Global Hackathon.

## Features
- **Solana Devnet Integration**: Verifies transactions and wallet signatures.
- **JWT Wallet Auth**: Passwordless authentication via Phantom Wallet.
- **Role-based Access**: BUYER, DEVELOPER, and ADMIN permissions.
- **PostgreSQL Database**: Uses Prisma ORM.

## Tech Stack
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- `@solana/web3.js`
- JWT & Zod

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your Supabase DB URL and Solana devnet parameters.
   ```bash
   cp .env.example .env
   ```

3. **Database Setup**
   ```bash
   npm run db:push
   npm run db:generate
   npm run db:seed
   ```

4. **Start Server**
   ```bash
   # Development (Hot-reload)
   npm run dev

   # Production Build
   npm run build
   npm start
   ```

## Solana Smart Contract
- **Devnet Program ID**: `<insert-from-teammate>`
- The backend verifies transactions directed to developers or the platform wallet on devnet.

## API Endpoints

### Auth (`/api/auth`)
- `GET /nonce?wallet=...` - Get signing nonce
- `POST /verify` - Verify signature & get JWT
- `GET /me` - Get current user

### Agents (`/api/agents`)
- `GET /` - List marketplace agents
- `GET /categories` - Get categories breakdown
- `GET /:slug` - Agent details
- `POST /` - Create listing (Developer only)
- `PUT /:id` - Update listing (Developer only)

### Purchases & Access (`/api/purchases`, `/api/access`)
- `POST /purchases/verify` - Verify Solana transaction and record purchase
- `GET /purchases/my` - View purchase history
- `GET /access/grant/:agentId` - Get gated agent URL (if purchased)
- `GET /access/my-agents` - View purchased agents

### Developer Dashboard (`/api/developer`)
- `POST /become` - Upgrade account to developer
- `GET /dashboard` - Earnings and stats
- `GET /agents` - Manage listings

### Demo (`/api/demo`)
- `GET /:agentId` - Get public demo link
- `POST /:agentId/log` - Log demo usage (analytics)

### Health
- `GET /api/health` - Server & DB status
