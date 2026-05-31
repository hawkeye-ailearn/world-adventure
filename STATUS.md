# World Quest — Status

## Last Updated
2026-05-31

---

## Build Progress

### ✅ Done

**Phase 1 — Project Shell**
- Vite + React 18 + Tailwind CSS + Express wired together (`npm run dev` starts both)
- `App.jsx` phase-based router (8 screens, no React Router)
- `HeroBar.jsx` with XP count-up animation and level display

**Phase 2 — All Screens (mock data)**
- `LandingScreen.jsx` — animated starfield, bouncing world emojis, gold title
- `HeroCreator.jsx` — name input + 3-class picker (Warrior / Wizard / Explorer)
- `WorldMap.jsx` — SVG winding path, 5 nodes, stars/locks/glows
- `WorldEntry.jsx` — per-world narrative intro with Scene SVG header
- `ChallengeScreen.jsx` — world bar, hearts, scene, narrative card, hint slide-in, MCQ/NumberPad
- `MCQInput.jsx` — 2×2 grid, A/B/C/D labels, green/red feedback, wrongIndex persists on 2nd attempt
- `NumberPad.jsx` — custom on-screen numpad, no iOS keyboard pop-up
- `ResultScreen.jsx` — 3 states (A: 1st correct, B: 2nd correct, C: both wrong), fun fact always shown
- `WorldComplete.jsx` — staggered star animation, next-world unlock message, final-world crown
- `GameComplete.jsx` — animated confetti, final hero title, world stars summary

**Phase 3 — Backend & Claude Service (built, not yet wired to UI)**
- `server/index.js` — Express proxy, API key server-side only
- `src/services/claude.js` — `fetchChallenge()` calls `/api/challenge`, parses JSON response
- `src/constants/prompts.js` — `buildSystemPrompt()` with world lock, class voice, challenge-type rules, JSON-only output
- `api/challenge.js` — Vercel serverless equivalent of the Express proxy (production)

**Phase 4 — Game Logic**
- `useGameState.js` — complete state machine: XP, levelling (4 tiers), world unlock, star rating, 2-attempt flow, boss (1 attempt), hint-on-first-wrong, `levelledUp` flag
- `src/worlds/index.js` — 5 world configs with colours, Scene refs, context strings, loading messages

**Phase 5 — Scene SVG Art**
- All 5 scenes complete: `EgyptScene`, `MedievalScene`, `SpaceScene`, `SafariScene`, `IndiaScene`
- All follow spec: `viewBox="0 0 380 180"`, no SVG gradients, layered opacity for depth

**Testing & CI**
- Vitest suite: 33 tests across `useGameState`, `claude.service`, `prompts` — all passing
- GitHub Actions CI: push/PR pipeline with lint (if present), test, build, artifact upload
- SonarCloud CPD exclusions in place

---

### ⚠️ Done — Needs Attention

- **Star rating edge case**: code returns 1 star for both 0 and 1 first-attempt correct, which matches spec ("1 star: 0–1"). Worth a second look once live questions are wired — the mock data always ends at challenge 4 with the same results, so real-world star distribution hasn't been tested live.
- **Error handling gap**: `useGameState` has no `challengeError` or `isLoadingChallenge` fields (defined in CLAUDE.md spec but not implemented). These will be needed when `useChallenge.js` is built.
- **`returnToMap` game-complete check**: `worldStates.every(w => w.completed)` fires *after* the current world's state update — relies on React state batching timing. Needs verification once all 5 worlds are completable end-to-end.
- **Tests not updated for Phase 4 additions**: `levelledUp` flag and per-world `xpEarned` field added in Phase 4 but existing test suite may not cover these fully.

---

### 🔨 In Progress

- **Phase 3 wiring**: `useChallenge.js` hook not yet created. The game still reads from `MOCK_CHALLENGES` in `useGameState.js`. `fetchChallenge` from `claude.js` is never called. Live Claude questions not flowing.
- **Phase 6 Polish (partial)**: CSS transitions are in place. Loading messages are defined in world config. But no loading UI is shown to the player while Claude responds.

---

### ⬜ Not Started

- `useChallenge.js` — fetch + prefetch logic (hides Claude's 2–3s latency during result screen)
- Wire `useChallenge` into `App.jsx` / `useGameState` — replace `MOCK_CHALLENGES` with live Claude calls
- Loading state UI — show world-specific loading message + spinner while Claude responds
- World-unlock animation on the map (visual celebration when a new node opens)
- Full Phase 6 polish: level-up celebration animation, map world-unlock animation
- GitHub secrets for Vercel deploy (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) — CI deploy job will fail without these
- Test coverage for Phase 4 game mechanics (`levelledUp`, `xpEarned` per world)

---

## Known Issues

### Bugs
_None confirmed._

### Limitations
- **Session-only state**: closing the browser resets all progress — intentional by design, but worth noting for Madhav's sessions
- **Mock data only**: until `useChallenge.js` is built and wired, every world plays the same 4 Egypt mock questions regardless of which world is selected

### Nice-to-haves
- Map world-unlock animation (visual pop/glow when a new world node unlocks)
- Sound effects (correct answer chime, level-up fanfare)
- iPad "Add to Home Screen" icon / PWA manifest

---

## Next Session — Pick Up From Here

**Build `useChallenge.js`** — this is the single most impactful next step. It should: call `fetchChallenge({ hero, world, challengeNumber })` from `claude.js`, manage `isLoading` and `error` states, prefetch the next challenge during the result screen to hide latency, and expose the result so `App.jsx` can replace `MOCK_CHALLENGES`. Once this hook exists and is wired into `useGameState` (or `App.jsx`), the game goes live with real Claude questions across all 5 worlds.
