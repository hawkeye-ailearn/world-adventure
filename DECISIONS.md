# DECISIONS.md — World Quest

Log of key architectural decisions: what was chosen and why.

---

## Why Express proxy (not direct API calls from the client)

The Anthropic API key must never appear in the browser bundle — any user could open DevTools and read it. The Express server in `server/index.js` acts as a thin proxy: the React client posts to `/api/challenge` on the same origin, and the server forwards the request to Anthropic using the key loaded from `.env`. The key never leaves the server process. Vite proxies `/api → localhost:3001` in dev so the client code doesn't change between dev and production.

---

## Why phase-based routing (not React Router)

World Quest has a strictly linear flow: landing → hero-creator → world-map → world-entry → challenge → result → world-complete → game-complete. There are no deep links, no back-button navigation, and no URL-addressable states a player would ever need. React Router adds dependency weight, URL concerns, and component tree complexity that buys nothing here. A single `phase` string in `useGameState` drives a switch in `App.jsx` — the entire router is five lines. Simpler is better for a home project.

---

## Why Vitest (not Jest)

The project uses Vite as its build tool. Vitest runs inside Vite's transform pipeline, which means it speaks the same ESM/JSX/Tailwind dialect as the app with zero extra config. Jest requires a separate Babel or ts-jest transform layer to handle ESM imports and JSX — extra packages, extra config files, and subtle mismatches between test and production transforms. For a Vite project, Vitest is the natural fit.

---

## Vercel project name is "world-quest"

The Vercel project is named `world-quest` (set in `vercel.json` under `"name"`). This name must match the project created in the Vercel dashboard. The GitHub Actions CI workflow reads `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` from repository secrets — these values come from the Vercel project settings page and must be added under GitHub repo Settings → Secrets → Actions before the deploy/preview jobs will succeed.

---

## Why Vercel serverless (not keeping Express for production)

The Express server is intentionally minimal — a single 50-line proxy file. Keeping a persistent Node process running in production would require a VPS or container, adding infrastructure to manage, pay for, and keep online. Vercel's serverless functions handle the same POST endpoint with zero server management: deploy the repo, add the env var, done. The function-per-route model also scales to zero when Madhav isn't playing, which costs nothing. The Express file stays for local dev (fast iteration, no cold starts), but production uses the serverless equivalent.
