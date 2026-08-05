# Oleevia DocFlow — deploy-ready package

This is the fixed `dms-demo-fixed.jsx` app wrapped in a minimal Vite + React
project so it can run as a real, standalone website (not just inside a
Claude artifact).

## What's inside
- `src/App.jsx` — the fixed app (login-button bug and multi-approve-button
  bug both resolved), with the full Oleevia logo intact.
- `src/main.jsx` — app entry point. Includes a small shim that backs
  `window.storage` with the browser's `localStorage`, since the app was
  originally built against the Claude-artifact-only storage API. Data
  (accounts, requests, audit trail) persists per-browser, same as the
  original demo.
- `index.html` — loads Tailwind via CDN (the app is styled entirely with
  Tailwind utility classes).
- `package.json`, `vite.config.js` — standard Vite + React build setup.

## Deploy to GitHub + Vercel

```bash
# 1. Push to your repo
cd oleevia-deploy
git init
git remote add origin https://github.com/gouthamnath-ai/OleeviaDMS.git
git add .
git commit -m "Oleevia DocFlow — fixed login + approval bugs"
git branch -M main
git push -u origin main

# 2. Deploy
npm install -g vercel   # if you don't already have it
vercel --prod
```

Or, after pushing to GitHub, import the repo at https://vercel.com/new and
Vercel will auto-build on every push (it auto-detects Vite).

## Run locally first (optional)

```bash
npm install
npm run dev
```

Quick demo logins (employee ID / password), shown on the login screen too:
- OGC100 / Admin@123 — Admin
- OGC111 / Welcome@123 — Requester (IT Department)
- OGC112 / Welcome@123 — Approver
- OGC113 / Welcome@123 — Accounts
