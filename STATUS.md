# World Quest — Status

## Last Updated
2026-05-31

---

## Build Progress

### ✅ Done

**Phase 1 — Project shell**
- Vite + React 18 + Tailwind CSS + Express running together (`npm run dev`)
- `App.jsx` phase-based router (8 screens, no React Router)
- `HeroBar.jsx` — persistent top bar with name, class emoji, level, title, XP count-up animation

**Phase 2 — All screens**
- `LandingScreen.jsx` — animated starfield, bouncing world emojis, "WORLD QUEST" title, Begin button
- `HeroCreator.jsx` — name input + 3-class picker (Warrior / Wizard / Explorer)
- `WorldMap.jsx` — illustrated `world-map.png` background with percentage-positioned overlays; locked/active/completed states with animations
- `WorldEntry.jsx` — per-world narrative intro, Scene SVG header, challenge-type preview icons
- `ChallengeScreen.jsx` — full question screen with HeroBar, world bar, hearts, Scene art, hint box, MCQInput or NumberPad
- `MCQInput.jsx` — 2×2 grid, A/B/C/D labels, green/red feedback, `wrongIndex` prop keeps wrong answer red on 2nd attempt
- `NumberPad.jsx` — custom on-screen numpad, no iOS keyboard pop-up, submit/backspace, visual correct/wrong feedback
- `ResultScreen.jsx` — 3 states: State A (1st-attempt correct), State B (2nd-attempt correct), State C (both wrong) — always shows fun fact
- `WorldComplete.jsx` — staggered star animation, next-world unlock message, final-world crown + "You completed World Quest!"
- `GameComplete.jsx` — animated confetti, hero title, world emoji row with stars, total XP

**Phase 3 — Backend & Claude service (infrastructure complete)**
- `server/index.js` — Express proxy; POST `/api/challenge` → Anthropic API; API key stays server-side
- `api/challenge.js` — Vercel serverless handler mirroring Express proxy
- `src/services/claude.js` — `fetchChallenge({ hero, world, challengeNumber })` — calls proxy, parses JSON response
- `src/constants/prompts.js` — `buildSystemPrompt()` — world lock, hero class voice, challenge type rules, JSON-only output contract

**Phase 4 — Game logic (fully wired to mock data)**
- `useGameState.js` — complete state machine: XP, levelling (Apprentice → Explorer → Champion → Legend), world unlock, star rating, 2 attempts/normal + 1 attempt/boss, hint-on-first-wrong, `levelledUp` flag, `getNextWorld()` helper
- Wrong answer → hint shown → second attempt ✅
- Boss (challenge 4) gets 1 attempt, no hint ✅
- Correct 1st attempt → full XP (100/200 for boss); 2nd attempt → half XP; both wrong → 0 XP ✅
- ResultScreen 3 states correct ✅
- XP thresholds → correct level + title ✅
- Star rating: 3 stars (≥3 first-attempt correct), 2 stars (2), 1 star (0–1) ✅
- World unlocks next world on completion; India → game-complete ✅

**Phase 5 — Scene SVG art**
- All 5 scenes: `EgyptScene.jsx`, `MedievalScene.jsx`, `SpaceScene.jsx`, `SafariScene.jsx`, `IndiaScene.jsx`
- All follow spec: `viewBox="0 0 380 180"`, no SVG gradients, layered opacity for depth, pure declarative SVG

**Phase 6 — Polish (partial)**
- Per-screen CSS transitions: `fadeIn`, `slideUp`, `popIn` (all ≤300ms)
- HeroBar XP bar: CSS `transition: width 0.6s ease-out`
- HeroBar XP number: rAF count-up animation over 800ms with cubic ease
- World-specific loading messages defined in `src/worlds/index.js`
- WorldMap zone animations: `goldPulse` (active zones) + `bob` (available zones)

**Testing & CI**
- Vitest suite: 33 tests across `useGameState`, `claude.service`, `prompts` — all passing
- GitHub Actions CI pipeline live (`test-and-build`, `deploy`, `preview` jobs)
- Vercel serverless deployment config (`vercel.json`, `api/challenge.js`)
- SonarCloud CPD exclusions added to pass duplication quality gate

---

### ⚠️ Done — Needs Attention

**Phase 3 partial — live Claude questions not wired**
- `server/index.js` and `src/services/claude.js` are fully built but `useGameState.js` still reads from `MOCK_CHALLENGES`
- No UI error state when API call fails (error thrown but not displayed to player)

**Phase 6 partial — polish items outstanding**
- Loading state UI not shown to player (loading messages defined in worlds config but no spinner/loading screen rendered)
- Map world-unlock animation (visual celebration when a new world opens) not implemented
- Level-up celebration animation (beyond the banner text) not implemented

---

### 🔨 In Progress

**Phase 3 — wiring live Claude questions**
- `useChallenge.js` hook needs to be created: fetch + prefetch logic to hide Claude latency during result screen
- `useGameState.js` `enterWorld()` and `continueFromResult()` need to call `fetchChallenge` instead of reading from `MOCK_CHALLENGES`

---

### ⬜ Not Started

- iPad viewport meta tags (`user-scalable=no`, `touch-action`) — not confirmed in `index.html`
- Map world-unlock celebration animation

---

## Known Issues

**WorldMap zone positions may need device tuning**
`ZONE_POSITIONS` in `src/components/WorldMap.jsx` are percentage coordinates hand-tuned against `world-map.png` at desktop resolution. The inner box is aspect-ratio-locked to `1448/1086` so overlays shouldn't drift, but minor position adjustments may be needed once tested on the actual iPad.

**No player-facing error UI**
If the Claude API call fails (network error, API key issue, etc.), `fetchChallenge` throws an error that currently has no UI handler. Once live Claude is wired, an error screen or retry prompt should be added.

---

## Next Session — Pick Up From Here

**Create `src/hooks/useChallenge.js`** — the only remaining Phase 3 task. The hook should: (1) call `fetchChallenge` from `claude.js`, (2) prefetch the next challenge during the result screen to hide Claude's 2–3s latency, (3) expose `isLoadingChallenge` and `challengeError` state. Then update `useGameState.js` `enterWorld()` and `continueFromResult()` to use it instead of `MOCK_CHALLENGES`. Once this is done, the game is fully live with Claude-generated questions.

---

## E2E Testing (added 2026-05-31)

**Playwright test suite — 195 tests, all passing**

`npm run test:e2e` — runs against Vite dev server, mock challenges, no API key needed.

- `playwright.config.js` — Chromium, 430×932 viewport, `npx vite` webServer
- `e2e/helpers.js` — shared navigation + per-question answer helpers
- 11 spec files: `01-landing` → `11-edge-cases` covering every game phase, XP/levelling, star ratings, boss challenge, full 5-world playthrough, and edge cases
- 30 `data-testid` attributes added across all interactive components for stable selectors

**`issues.md`** — 15 issues catalogued (7 game code, 5 test fixes, 7 coverage gaps for future phases). Key open items: `GameComplete` shows hardcoded ⭐⭐⭐ regardless of actual stars earned; no loading UI; no unlock/level-up animations. Full details in `issues.md`.
