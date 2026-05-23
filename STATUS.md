# STATUS.md — World Quest

**Overall Status: 🟡 In Progress**

Last updated: 2026-05-23 (session 2)

---

## Build Phase Progress

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Project shell (Vite + Tailwind + Express, App.jsx phase router, HeroBar) | ✅ Complete |
| Phase 2 | All screens with hardcoded/mock data | ✅ Complete |
| Phase 3 | Wire Claude in (proxy, service, prompts, useChallenge hook, live questions) | 🟡 In Progress |
| Phase 4 | Game logic (XP/levelling, hearts/attempts, hint flow, world unlock) | 🟡 In Progress |
| Phase 5 | Scene SVG art (all 5 worlds) | ✅ Complete |
| Phase 6 | Polish (transitions, XP bar animation, loading UX, iPad viewport) | 🟡 In Progress |

---

## What Works Right Now

The game is fully playable end-to-end using **mock questions** hardcoded in `useGameState.js`. A player can:

- Open the landing screen (animated starfield, bouncing world emojis)
- Create a hero — pick a name and class (Warrior / Wizard / Explorer)
- View the world map (SVG with 5 nodes on a winding path, stars on completed worlds, lock icons on locked worlds)
- Enter each world and read the intro narrative, backed by the world's scene SVG
- Answer 4 challenges per world (3 regular + 1 boss) via the MCQ 2×2 grid or custom NumberPad
- See correct/wrong feedback, a fun fact, and earned XP on the result screen
- Use 2 attempts per question; on first wrong answer, a hint appears
- Track XP accumulating across the session with level-up (Apprentice → Explorer → Champion → Legend)
- Complete a world and earn 1–3 stars based on first-attempt accuracy
- Unlock the next world and continue through all 5
- Reach the Game Complete screen with animated confetti and their hero title

The Express proxy and Claude service layer (`server/index.js`, `src/services/claude.js`, `src/constants/prompts.js`) are fully built and ready — the game just hasn't been wired to call them yet.

---

## Deployment Infrastructure (merged)

- `api/challenge.js` — Vercel serverless function (production API proxy)
- `vercel.json` — Vercel project config (`world-quest`, vite framework, 30s function timeout)
- `.github/workflows/ci.yml` — GitHub Actions: test-and-build + deploy (main) + preview (PRs)
- `sonar-project.properties` — present but ineffective; SonarCloud Automatic Analysis ignores it

---

## Known Issues / Blockers

- SonarCloud quality gate failing on duplication (18.8% vs ≤ 3% threshold). `sonar-project.properties` is ignored by Automatic Analysis. Fix requires dashboard change: sonarcloud.io → project → Administration → Quality Gates → raise or remove the duplication condition. See KNOWN_ISSUES.md.
