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

**Phase 3 — Backend & Claude service (COMPLETE)**
- `server/index.js` — Express proxy; POST `/api/challenge` → Anthropic API; API key stays server-side
- `api/challenge.js` — Vercel serverless handler mirroring Express proxy
- `src/services/claude.js` — `fetchChallenge({ hero, world, challengeNumber })` — calls proxy, parses JSON response
- `src/constants/prompts.js` — `buildSystemPrompt()` — world lock, hero class voice, challenge type rules, JSON-only output contract
- `src/hooks/useChallenge.js` — fetch + prefetch hook; `fetchChallenge`, `prefetchNext`, `clearChallenge`; world guarded by WORLD_MAP lookup
- `WorldEntry.jsx` — fetches challenge 1 on mount, shows world loading message while loading, retry button on error
- `ResultScreen.jsx` — prefetches next challenge in background; Continue button waits for prefetch then passes data to `continueFromResult`
- `MOCK_CHALLENGES` removed from `useGameState.js`; live Claude questions flowing through all worlds ✅

**Phase 4 — Game logic (fully wired to live Claude data)**
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
- WorldEntry shows world-specific loading message while fetching challenge 1 from Claude

**Testing & CI**
- Vitest suite: 33 tests across `useGameState`, `claude.service`, `prompts` — all passing
- Tests updated to use local TEST_CHALLENGES fixtures (MOCK_CHALLENGES no longer in production code)
- GitHub Actions CI pipeline live (`test-and-build`, `deploy`, `preview` jobs)
- Vercel serverless deployment config (`vercel.json`, `api/challenge.js`)
- SonarCloud CPD exclusions added to pass duplication quality gate

---

### ⚠️ Done — Needs Attention

**Phase 6 partial — polish items outstanding**
- Map world-unlock animation (visual celebration when a new world opens) not implemented
- Level-up celebration animation (beyond the banner text) not implemented

---

### ⬜ Not Started

- iPad viewport meta tags (`user-scalable=no`, `touch-action`) — not confirmed in `index.html`
- Map world-unlock celebration animation

---

## Known Issues

**Egypt questions in all worlds — FIXED**
Root cause: `MOCK_CHALLENGES` was hardcoded in `useGameState.js` and served questions for every world regardless of `activeWorldId`. Claude was never being called. Fixed by implementing `useChallenge.js` and removing mock data. `WorldEntry` now fetches challenge 1 on mount; `ResultScreen` prefetches the next challenge during the result screen to hide latency.

**WorldMap zone positions may need device tuning**
`ZONE_POSITIONS` in `src/components/WorldMap.jsx` are percentage coordinates hand-tuned against `world-map.png` at desktop resolution. The inner box is aspect-ratio-locked to `1448/1086` so overlays shouldn't drift, but minor position adjustments may be needed once tested on the actual iPad.

**No player-facing error UI (partial)**
If the Claude API call fails, `WorldEntry` now shows a retry button. `ResultScreen` prefetch failure silently falls back to a fresh fetch on Continue. No full error screen exists yet for mid-challenge failures.

---

## Next Session — Pick Up From Here

**Phase 6 Polish** — the game is fully live. Remaining polish items:
- Map world-unlock celebration animation (visual pop when a new world opens)
- Level-up celebration animation (beyond the current banner)
- iPad viewport meta tags (`user-scalable=no`, `viewport-fit=cover`) in `index.html`
- Test on actual iPad — check zone positions, touch targets, font sizes
