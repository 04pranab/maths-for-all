# Maths for All API Worker

This directory contains the Cloudflare Worker API foundation for the Maths for
All GitHub Pages frontend.

## Current state

The Worker currently provides a health endpoint, exact-origin CORS handling,
score normalization/validation utilities, and tests. Account and leaderboard
routes deliberately return HTTP 503 until the database provider is confirmed
and the persistent adapter is implemented.

## Local checks

From this directory:

```bash
npm test
```

To run the Worker locally after installing Wrangler:

```bash
cp .dev.vars.example .dev.vars
npm install
npm run dev
```

Then visit `http://localhost:8787/health`.

## Deploy

Do not deploy this as a live account service yet. Before deployment, confirm
the database, configure the production frontend origin, implement persistence
and authentication, and complete the security and integration tests.
