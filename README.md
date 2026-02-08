# FinModel Lab

FinModel Lab is a full-stack financial modeling platform for learning and simulation. It combines educational explanations with editable assumptions, live outputs, visual charts, and real market API data.

## Stack
- **Frontend:** React + Vite + Tailwind CSS + Recharts + Framer Motion + Context API
- **Backend:** Node.js + Express API proxy with caching, rate limiting, and error handling

## Features
- Home page with modeling education + CTA
- Dashboard of 8 core models
- Dedicated model page pattern: formula, inputs, outputs, chart, analyst guidance
- Real data integration via backend proxy:
  - Financial Modeling Prep
  - Alpha Vantage
  - World Bank
  - Open Exchange Rates key support (prepared in env)
- Dark/light mode toggle
- Save scenario locally (Context API + localStorage)
- Company comparison inputs for side-by-side example
- CSV and PDF export utilities
- Mobile-responsive fintech layout with sticky header + sidebar
- Unit tests for core calculations + API fetch handling

## Project Structure
```
/client   # React app
/server   # Express API proxy
```

## Setup
1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Add API keys in `.env`.
3. Install dependencies:
   ```bash
   npm run install:all
   ```
4. Run locally:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173`

## Testing
```bash
npm --prefix server test
npm --prefix client test
```

## Deployment
### Frontend (Vercel)
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Add `VITE_API_URL` env var pointing to deployed backend

### Backend (Render)
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Add server API key env vars from `.env.example`

## Notes
- In production, use Redis or managed cache for distributed instances.
- Add persistent auth (JWT/session provider) if enabling login.
