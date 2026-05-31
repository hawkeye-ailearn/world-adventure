# issues.md — World Quest

Issues discovered during the e2e test plan implementation (2026-05-31).
Each entry includes the location, description, impact, and current status.

---

## 1. Game Code Issues

### 1.1 Mock challenges ignore the selected world
**File:** `src/hooks/useGameState.js` — `enterWorld()` and `continueFromResult()`
**Description:** All five worlds serve the same four hardcoded Egypt questions
(`MOCK_CHALLENGES`) regardless of which world the player selected. When you enter
Medieval, Space, Safari, or India you still see pyramids, pharaohs, and the Nile.
**Impact:** Every world is functionally identical until the Claude API is wired.
**Status:** Known / intentional for Phase 2 (mock data). Will be resolved when
`useChallenge.js` is built and MOCK_CHALLENGES is replaced with `fetchChallenge`.
**Detected by:** e2e test `10-full-game.spec.js` — all five worlds use the same MCQ
answers `[1, '61', 1, 2]` regardless of world identity.

---

### 1.2 `useChallenge.js` hook not built
**File:** `src/hooks/` — file does not exist
**Description:** The STATUS.md lists `useChallenge.js` (fetch + prefetch logic) as not
yet created. `fetchChallenge` in `src/services/claude.js` is fully implemented but is
never called from any game component. The `isLoadingChallenge` and `nextChallenge`
state fields described in CLAUDE.md also do not exist in `useGameState.js`.
**Impact:** Live Claude questions cannot flow into the game. The loading state UI
(per-world loading messages like "The Sphinx is thinking…") is defined in
`src/worlds/index.js` but has no consumer.
**Status:** Phase 3 in progress. Blocked on wiring.
**Affected tests:** All challenge tests in `05-`–`07-` specs will need network mocking
once this is live.

---

### 1.3 No loading state shown to the player
**File:** `src/components/` — no `LoadingScreen` or loading overlay component exists
**Description:** When Claude takes 2–3 seconds to respond, the game has no visual
feedback. The per-world loading messages ("Mission Control is calculating…", etc.) are
defined in `src/worlds/index.js` under `loadingMessage` but are not rendered anywhere.
**Impact:** Once live API is wired, players will see a blank or frozen screen during
each network round-trip.
**Status:** Open. Needs a `LoadingScreen` or inline spinner component and integration
in `useChallenge.js`.
**Spec coverage:** No e2e test yet — depends on `useChallenge.js` being built first.

---

### 1.4 World-unlock map animation not implemented
**File:** `src/components/WorldMap.jsx`
**Description:** CLAUDE.md specifies a "visual celebration when a new world opens" on
the world map. Currently unlocking the next world just silently changes the node
appearance (glow ring becomes active, lock icon disappears, cursor changes to pointer).
There is no pop animation, particle effect, or entrance animation.
**Impact:** Low — a nice-to-have polish item. The unlock itself works correctly.
**Status:** Phase 6 (polish) item, unimplemented.
**Detected by:** Manual inspection during test writing.

---

### 1.5 Level-up has no celebration UI
**File:** `src/components/HeroBar.jsx`, `src/hooks/useGameState.js`
**Description:** When `totalXP` crosses a level threshold (300/700/1200 XP), the
`hero.level` and `hero.title` fields update instantly. The XP bar animates via CSS
`transition-all duration-500` but there is no level-up modal, banner, or fanfare.
**Impact:** Low — cosmetic. The XP and level numbers do update correctly.
**Status:** Phase 6 (polish) item, unimplemented.
**Spec coverage:** `08-xp-and-levelling.spec.js` tests that the level text updates
but does not test for a celebration animation.

---

### 1.6 `returnToMap()` race condition risk
**File:** `src/hooks/useGameState.js` — `returnToMap()` (line 226–234)
**Description:** `returnToMap()` checks `worldStates.every(w => w.completed)` using
the state at call time. The fifth world's completion state is set via `setWorldStates`
inside `continueFromResult()`, which runs just before `setPhase('world-complete')`.
React batches these state updates in React 18, so by the time the player clicks
"Back to World Map" on the `world-complete` screen, `worldStates` should already
reflect the completed fifth world. In practice this works, but the implementation
relies on React 18's automatic batching to guarantee the state is current before
`returnToMap` reads it.
**Impact:** Low in current React 18 environment. Could become a bug if the app is
ever run under React 17 or in a concurrent edge case.
**Status:** Low-priority / informational.
**Detected by:** Code review during full-game test writing.

---

### 1.7 `GameComplete` shows hardcoded three-star row for all worlds
**File:** `src/components/GameComplete.jsx` (lines 78–88)
**Description:** The final screen displays each world emoji with a fixed `⭐⭐⭐`
string below it, regardless of how many stars the player actually earned in each world.
```jsx
<span style={{ fontSize: 10 }}>⭐⭐⭐</span>
```
A player who scored 1 star in some worlds will still see three stars on the final
screen.
**Impact:** Medium — misleading to the player; undermines the star-rating mechanic.
**Status:** Bug, open.
**Detected by:** `10-full-game.spec.js` — the test asserts `game-complete-screen`
shows world emojis but does not verify per-world star accuracy (test was written
conservatively to avoid asserting the broken behaviour).

---

### 1.8 `ChallengeScreen` hearts use font-size inline style, making DOM selector fragile
**File:** `src/components/ChallengeScreen.jsx` (hearts mapping)
**Description:** Heart icons are `<span style={{ fontSize: 18 }}>❤️</span>`. The e2e
tests locate hearts via:
```js
page.locator('[style*="font-size: 18"]').filter({ hasText: '❤️' })
```
This selector is fragile — any other element with `font-size: 18` and emoji content
would match. If the styling changes, the heart-count tests break.
**Impact:** Low for now. Test passes but is brittle.
**Recommendation:** Add `data-testid="heart-icon"` to each heart span, or wrap hearts
in a `data-testid="hearts-container"` div.
**Status:** Open / low priority.

---

## 2. Test Suite Issues (found and fixed)

### 2.1 `getByTestId` selectors were missing from all component files
**Files:** All components in `src/components/`
**Description:** None of the React components had `data-testid` attributes, making
reliable element selection impossible with Playwright's `getByTestId()`. The
StrReplace tool experienced a caching/file-write inconsistency where some edits were
reported as successful but did not persist to disk. A Python script was used as a
reliable workaround to apply all attributes in one pass.
**Resolution:** 30 `data-testid` attributes added across 11 components. All test
selectors now use stable test IDs rather than fragile CSS or text matches.
**Status:** Fixed.

### 2.2 Strict mode violation — `getByText('Great Pyramid of Giza')`
**File:** `e2e/05-challenge-mcq.spec.js`
**Description:** The narrative paragraph and the question text both contain the phrase
"Great Pyramid of Giza", causing Playwright strict-mode to throw when a single element
was expected. The narrative reads *"You stand before the Great Pyramid of Giza!"* and
the question reads *"Who built the Great Pyramid of Giza?"*.
**Resolution:** Changed selector to the full unique sentence:
`getByText('You stand before the Great Pyramid of Giza!')`.
**Status:** Fixed.

### 2.3 Strict mode violation — `getByText('5')` on boss result screen
**File:** `e2e/07-boss-challenge.spec.js`
**Description:** After a wrong boss answer, both `<strong>5</strong>` (the correct
answer) and the fun-fact paragraph (which contains "5 faces") match `getByText('5')`.
**Resolution:** Changed to `page.locator('strong').filter({ hasText: '5' })` for
precise targeting of the highlighted correct-answer element.
**Status:** Fixed.

### 2.4 `HeroBar` not rendered on `world-map` phase
**Files:** `e2e/02-hero-creator.spec.js`, `e2e/03-world-map.spec.js`,
`e2e/08-xp-and-levelling.spec.js`, `e2e/11-edge-cases.spec.js`
**Description:** `HeroBar` is only rendered inside `ChallengeScreen`, `ResultScreen`,
and `WorldComplete`. It is absent from `LandingScreen`, `HeroCreator`, `WorldMap`, and
`WorldEntry`. Several tests incorrectly asserted `hero-bar-xp` and `hero-bar-level`
immediately after hero creation (which lands on `world-map`).
**Resolution:** Updated affected tests to navigate one step further — into the Egypt
challenge screen — before asserting HeroBar content.
**Status:** Fixed.

### 2.5 Strict mode violation — `getByText('Ancient Egypt')` on world-entry screen
**File:** `e2e/04-world-entry.spec.js`
**Description:** `getByText('Ancient Egypt')` matched three elements on the world-entry
screen: the `<h2>` heading, the narrative paragraph (which contains "Ancient Egypt"),
and the "Enter Ancient Egypt!" button text.
**Resolution:** Changed to `getByRole('heading', { name: 'Ancient Egypt' })` to target
only the heading element.
**Status:** Fixed.

---

## 3. Test Coverage Gaps (pending future work)

### 3.1 No API / network mocking
The game currently uses `MOCK_CHALLENGES` and never calls `/api/challenge`. When
`useChallenge.js` is built and live Claude questions are wired, all challenge tests
will need a Playwright `route()` intercept to mock `POST /api/challenge` with a
deterministic `ChallengeData` response so tests remain offline and fast.

### 3.2 No tests for loading state
Once the loading UI is built (Phase 6), tests should verify that:
- The world-specific loading message ("The Sphinx is thinking…") appears while the
  fetch is in progress.
- The loading spinner/screen disappears once the challenge data arrives.
- If the fetch takes longer than expected, the UI does not freeze.

### 3.3 No tests for API error handling
`src/services/claude.js` throws on non-OK HTTP responses, but there is no error
handling in the game state (`challengeError` is not surfaced to any component). Tests
should verify that a network failure shows a user-friendly error rather than a blank
screen or uncaught exception.

### 3.4 No tests for level-up celebration animation (once built)
When the celebration UI is implemented (Phase 6), tests should verify that the
animation triggers on the exact XP threshold crossings (300, 700, 1200 XP).

### 3.5 No tests for world-unlock animation (once built)
When the map unlock animation is implemented, tests should verify it plays after the
fifth challenge of a world is completed and the player returns to the map.

### 3.6 No visual regression tests
The five SVG scene components (`EgyptScene`, `MedievalScene`, etc.) have no automated
coverage. A visual snapshot test (e.g. Playwright `toHaveScreenshot`) would catch
unintended visual regressions in the hand-crafted SVG art.

### 3.7 Full-game test timeout is generous (2 min)
`10-full-game.spec.js` has `test.setTimeout(120_000)`. With 5 worlds × 4 questions
each and ~1–2 s per question interaction, the test takes ~30–45 s on current hardware.
The generous timeout is intentional safety margin, but once the suite is stable the
timeout can be tightened to ~60 s.

---

## 4. Summary

| # | Severity | Area | Status |
|---|----------|------|--------|
| 1.1 | High | Game logic — mock data | Known / planned fix |
| 1.2 | High | Architecture — missing hook | Phase 3 in progress |
| 1.3 | Medium | UX — missing loading screen | Phase 6 open |
| 1.4 | Low | Polish — map unlock animation | Phase 6 open |
| 1.5 | Low | Polish — level-up celebration | Phase 6 open |
| 1.6 | Low | Code — state batching assumption | Informational |
| 1.7 | Medium | Bug — hardcoded stars on GameComplete | Open |
| 1.8 | Low | Tests — fragile heart selector | Open |
| 2.1 | — | Tests — missing data-testids | Fixed |
| 2.2 | — | Tests — strict mode violation | Fixed |
| 2.3 | — | Tests — strict mode violation | Fixed |
| 2.4 | — | Tests — HeroBar on wrong screen | Fixed |
| 2.5 | — | Tests — strict mode violation | Fixed |
| 3.1–3.7 | — | Tests — coverage gaps | Pending future phases |
