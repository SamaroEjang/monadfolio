# MonadFolio

> Track your shMON liquid staking position on Monad Mainnet - with live APY, yield estimates, and AI-powered insights.

Built for **Monad Blitz Lagos** - Theme: Building Consumer Applications on Monad

---

## What it does

MonadFolio is a read-only portfolio tracker for shMON liquid staking on Monad Mainnet. Paste any wallet address to instantly see:

- shMON balance and underlying MON value
- Live APY pulled from DefiLlama
- MON price from CoinGecko
- USD value of your staking position
- Daily and annual yield estimates
- Interactive yield calculator - type any amount, adjust APY, see earnings across 6 time periods
- AI insight - Claude writes a plain-English summary of your portfolio

No wallet connection required. Read-only. Works on any device.

---

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Blockchain: ethers.js connected to Monad Mainnet RPC
- APY data: DefiLlama API
- Price data: CoinGecko API
- AI narration: Anthropic Claude (Haiku)

---

## Contract Addresses

- shMON Monad Mainnet: 0x1B68626dCa36c7fE922fD2d55E4f631d962dE19c

---

## Running Locally

Requirements: Node.js v18+ and an Anthropic API key

Backend:
cd backend
npm install
cp .env.example .env
npm run dev

Frontend:
cd frontend
npm install
npm run dev

Environment variables in backend/.env:
PORT=3001
ANTHROPIC_API_KEY=sk-ant-...
MONAD_RPC=https://rpc.monad.xyz

---

## API Endpoints

GET /api/portfolio/:wallet - Full portfolio data for a wallet address
GET /api/market - Current MON price and shMON APY
GET /health - Health check

---

## Team

Built by MARO at Monad Blitz Lagos 2026