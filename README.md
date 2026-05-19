# Ordinal Vault

Provenance registry for fine art trading card BTC ordinals.

## Setup

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local and set ADMIN_SECRET to something strong
npm run dev
```

## Pages

- `/` — Public vault checker (paste address or NFC auto-populates `?vault=ADDRESS`)
- `/admin` — Admin-only registration form (password gated)

## Deploying to Vercel

1. Push this repo to GitHub
2. Import in Vercel
3. Add environment variable: `ADMIN_SECRET` = your secret password
4. Deploy

## NFC Tags

Program each NFC tag to open:
```
https://yoursite.com/?vault=WALLET_ADDRESS
```

The checker page reads the `vault` query param and auto-runs the lookup.

## Data Storage

Vault records live in `data/vaults.json`. On Vercel this file is **read-only after deploy** — each deploy snapshot the data. 

### For 160+ records: recommended workflow
1. Use the admin form locally (`npm run dev`) to register all vaults
2. The `data/vaults.json` file grows with each entry
3. Commit and push `data/vaults.json` to GitHub
4. Vercel redeploys with all records baked in
5. For future additions: add locally, push, redeploy (takes ~30 seconds)

This keeps it simple with zero database costs.
