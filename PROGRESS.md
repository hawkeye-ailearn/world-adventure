# PROGRESS.md — World Quest

Running changelog of what was built, session by session.

---

## [2026-05-23] — GitHub Actions CI/CD + Vercel project name

### What was built

- `.github/workflows/ci.yml` — three-job pipeline:
  - `test-and-build`: runs on every push and on PRs to main; checkout → Node 20 + npm cache → `npm ci` → lint (if present) → `npm run test:run` → `npm run build` → uploads `dist/` as artifact
  - `deploy`: push to `main` only, needs `test-and-build`; installs Vercel CLI, pulls production env, builds with `--prod`, deploys prebuilt, posts deployed URL as a commit comment
  - `preview`: PRs only, needs `test-and-build`; same flow with `--environment=preview`, posts preview URL as a PR comment
- `vercel.json` — added `"name": "world-quest"` field
- `DECISIONS.md` — logged Vercel project name and secret requirements

### What was unchanged

- `server/index.js`, `vite.config.js`, `api/challenge.js` — untouched

### What was left incomplete

- Three GitHub secrets must be manually added in repo Settings → Secrets → Actions: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- `npm run test:run` script not yet in `package.json` (Vitest not installed yet); CI `test-and-build` job will fail until testing is set up

---

## [2026-05-23] — Vercel deployment: serverless API function + config

### What was built

- `api/challenge.js` — Vercel serverless handler (ESM `export default async function handler`); mirrors `server/index.js` exactly: POST-only, reads `messages` + `systemPrompt` from body, proxies to Anthropic `/v1/messages`, returns raw JSON; non-POST requests get 405
- `vercel.json` — Vercel project config: `buildCommand: npm run build`, `outputDirectory: dist`, `framework: vite`, rewrite `/api/:path*` → `/api/:path*`, `maxDuration: 30` on `api/challenge.js`

### What was unchanged

- `server/index.js` — untouched; continues to serve local dev on port 3001
- `vite.config.js` proxy to port 3001 — untouched; local dev flow unaffected

### What was left incomplete

- `ANTHROPIC_API_KEY` must be added as a Vercel environment variable before deployment will work

---

## [2026-05-23] — Initial build: full game shell through mock play

### What was built

**Phase 1 — Project shell**
- Vite + React 18 + Tailwind CSS + Express.js dev environment wired together; `npm run dev` starts both Vite (port 5173) and Express (port 3001) concurrently
- `App.jsx` — phase-based router managing all 8 game screens (landing, hero-creator, world-map, world-entry, challenge, result, world-complete, game-complete); no React Router
- `HeroBar.jsx` — persistent top bar showing hero name (gold), class emoji, level title, and XP progress bar with smooth fill transition
- `index.css` — Tailwind base + Google Fonts (Fredoka One, Nunito) + custom CSS animations (fadeIn, slideUp, popIn, shimmer, twinkle, bounce)
- `tailwind.config.js` — extended with Fredoka One and Nunito font families

**Phase 2 — All screens**
- `LandingScreen.jsx` — animated starfield, bouncing world emojis, gold "WORLD QUEST" title, "Begin Adventure" CTA
- `HeroCreator.jsx` — name input (max 20 chars) + 3 class picker buttons (Warrior / Wizard / Explorer) with emoji, descriptions, and class-specific accent colors; submit disabled until both fields filled
- `WorldMap.jsx` — SVG (380×520 viewBox), 5 world nodes on a winding path, dashed locked / solid unlocked connecting lines, star indicators on completed worlds, lock/check overlays, glow pulse on available worlds
- `WorldEntry.jsx` — per-world narrative intro card, Scene SVG header, 4 challenge-type preview icons (Q1/Q2/Q3/BOSS), themed "Enter [World]" button
- `ChallengeScreen.jsx` — full question screen: HeroBar + world bar (emoji, challenge-type icon, heart indicators) + Scene SVG + question/narrative card + hint box + MCQInput or NumberPad + boss challenge banner
- `MCQInput.jsx` — 2×2 grid, 4 answer options, A/B/C/D labels in colored circles, world accent colors, green/red feedback states after submission
- `NumberPad.jsx` — custom on-screen number input (3×4 grid, 0–9, backspace, submit); no iOS keyboard pop-up; result shown inline in display area
- `ResultScreen.jsx` — correct/wrong badge, reaction or "not quite" message, correct answer reveal on wrong, XP earned display, fun fact card, Try Again / Continue buttons
- `WorldComplete.jsx` — trophy, staggered star animation (one star per 400 ms), heading varies by star count, world star total, Back to Map button
- `GameComplete.jsx` — animated confetti (20 emoji items), final hero title, world emoji row with stars, total XP display

**Phase 3 — Backend & Claude service (infrastructure complete, not yet wired to UI)**
- `server/index.js` — Express proxy; `POST /api/challenge` receives systemPrompt + messages, forwards to Anthropic `/v1/messages` (model: claude-sonnet-4-20250514), returns full response; API key stays server-side
- `src/services/claude.js` — `fetchChallenge({ hero, world, challengeNumber })` async function; calls `/api/challenge`, parses JSON response into ChallengeData
- `src/constants/prompts.js` — `buildSystemPrompt()` function; injects hero name, class voice guide (Warrior / Wizard / Explorer tone), world context, challenge number, maths difficulty constraints (Grade 2–3), JSON-only output rules, narrative age-appropriateness rules

**Phase 4 — Game logic**
- `useGameState.js` — complete game state machine: XP accumulation, level thresholds (Apprentice 0–299 / Explorer 300–699 / Champion 700–1199 / Legend 1200+), world unlock on world complete, star rating (3/2/1 based on first-attempt correct count), attempt tracking (2 per normal challenge, 1 for boss), hint-on-first-wrong flow, submitAnswer / tryAgain / continueFromResult actions
- `src/worlds/index.js` — 5 world config objects (Egypt, Medieval, Space, Safari, India) with per-world accent colors, light/dark backgrounds, text colors, Scene component refs, Claude context strings, and loading messages

**Phase 5 — Scene SVGs**
- `EgyptScene.jsx` — pyramids, Nile river, sand foreground, sun, palm trees; warm tan/gold sky via layered opacity rects
- `MedievalScene.jsx` — castle with stone walls, forest, moonlight
- `SpaceScene.jsx` — starfield, Saturn, Earth horizon, space station truss
- `SafariScene.jsx` — savanna, acacia trees, animal silhouettes (lions, elephants, giraffes)
- `IndiaScene.jsx` — temple gopuram, elephant, lotus pond, sunset sky
- All follow spec: `viewBox="0 0 380 180"`, no SVG gradients, layered opacity for depth, pure declarative SVG (no JS, no interactivity)

**Phase 6 — Polish (partial)**
- Per-screen CSS transitions applied (fadeIn, slideUp, popIn — all under 300 ms)
- XP bar width animates with `transition-all duration-500`
- World-specific loading messages defined in worlds config ("The Sphinx is thinking…" etc.)

### What was changed

_First session — no prior state to diff against._

### What was left incomplete

- `useChallenge.js` hook not created — fetch + prefetch logic (hide Claude latency during result screen) still needs building
- Game still reads from `MOCK_CHALLENGES` in `useGameState.js`; `fetchChallenge` from `claude.js` is never called — live Claude questions not wired
- Map world-unlock animation (visual celebration when a new world opens) not implemented
- iPad viewport meta tags (`<meta name="viewport">`, touch-action, user-scalable) not confirmed in `index.html`
- Loading state UI not shown to player (messages defined but no spinner/loading screen while Claude responds)
