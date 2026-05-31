# CLAUDE.md — World Quest

> See STATUS.md for current progress.

## What This Is

World Quest is a Claude-powered educational RPG game built for Madhav, a 7-year-old
boy, to play on an iPad browser. The player picks a hero, travels through 5 themed
worlds across history and science, and answers questions about maths, history, and
general knowledge. Claude generates all questions and narratives dynamically.

This is a personal home project. Prioritise fun, polish, and kid-friendliness over
enterprise-grade patterns. Keep code readable. Don't over-engineer.

---

## 🔄 Session Protocol

Every Claude Code session working on this project MUST follow this protocol, no exceptions:

**START OF SESSION:**
1. Read CLAUDE.md fully (you are doing this now)
2. Read STATUS.md to understand current project state
3. Do not write any code until steps 1–2 are done

**END OF SESSION (before closing):**
1. Update STATUS.md — move items between Done / Needs Attention / In Progress / Not Started to reflect what was completed, and update the "Next Session" line
2. Add any new bugs or limitations discovered to the Known Issues section of STATUS.md
3. If an architectural decision was made, log it in DECISIONS.md

This is non-negotiable. A session that builds but does not update the status files is an incomplete session.

---

## Tech Stack

| Layer      | Choice                  | Notes                                     |
|------------|-------------------------|-------------------------------------------|
| Frontend   | React 18 + Vite         | Fast dev, clean build                     |
| Styling    | Tailwind CSS            | World-specific theming via Tailwind vars  |
| State      | useState + Context      | No Redux — game state is simple enough    |
| Backend    | Express.js (1 file)     | API proxy only — keeps key off the client |
| AI         | Claude claude-sonnet-4-20250514 | Via /v1/messages, JSON-mode prompting     |
| Fonts      | Fredoka One + Nunito    | Loaded from Google Fonts CDN              |

The Express server runs on port 3001 locally. In dev, Vite proxies /api → 3001.
The iPad hits the Mac's local IP over wifi — no internet deployment needed.

---

## Project Structure

```
world-quest/
├── CLAUDE.md                       ← You are here
├── server/
│   └── index.js                    ← Express proxy (40 lines, API key lives here)
├── src/
│   ├── App.jsx                     ← Phase-based router (no react-router)
│   ├── main.jsx                    ← Vite entry point
│   ├── index.css                   ← Tailwind base + font imports
│   ├── components/
│   │   ├── HeroBar.jsx             ← Persistent top bar (name, class, XP, level)
│   │   ├── HeroCreator.jsx         ← Name input + class picker (Warrior/Wizard/Explorer)
│   │   ├── WorldMap.jsx            ← SVG terrain map with winding path
│   │   ├── WorldEntry.jsx          ← Claude narrative intro for each world
│   │   ├── ChallengeScreen.jsx     ← Wraps MCQInput or NumberPad based on type
│   │   ├── MCQInput.jsx            ← 2×2 grid of answer buttons (touch-friendly)
│   │   ├── NumberPad.jsx           ← On-screen number pad (no keyboard pop-up)
│   │   ├── ResultScreen.jsx        ← Correct/wrong feedback + fun fact + XP
│   │   ├── WorldComplete.jsx       ← World summary, star rating, unlock next
│   │   └── GameComplete.jsx        ← Final screen with hero title
│   ├── scenes/                     ← SVG backdrop art, one per world (Claude Design)
│   │   ├── EgyptScene.jsx          ← Desert, pyramids, Nile, palm trees, moon
│   │   ├── MedievalScene.jsx       ← Castle, forest, moonlit stone walls
│   │   ├── SpaceScene.jsx          ← Stars, Saturn, Earth curve, station truss
│   │   ├── SafariScene.jsx         ← Savanna, acacia trees, animal silhouettes
│   │   └── IndiaScene.jsx          ← Temple gopuram, elephant, lotus pond, sunset
│   ├── worlds/
│   │   └── index.js                ← 5 world config objects (id, colours, context)
│   ├── services/
│   │   └── claude.js               ← fetch('/api/challenge'), returns parsed JSON
│   ├── hooks/
│   │   ├── useGameState.js         ← All game state + transitions
│   │   └── useChallenge.js         ← Fetch + prefetch challenge logic
│   └── constants/
│       └── prompts.js              ← buildSystemPrompt() — the Game Master prompt
├── .env                            ← ANTHROPIC_API_KEY=... (never commit)
├── .env.example                    ← Template (safe to commit)
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## Game State Shape

All game state lives in `useGameState`. This is the single source of truth.

```js
{
  // Which screen is showing
  phase: 'landing' | 'hero-creator' | 'world-map' | 'world-entry' |
         'challenge' | 'result' | 'world-complete' | 'game-complete',

  // The player's hero
  hero: {
    name: '',                              // Madhav's chosen name
    class: 'warrior' | 'wizard' | 'explorer',
    level: 1,                             // 1–4
    title: 'Apprentice',                  // Derived from XP
    xp: 0,
    totalXP: 0,                           // Cumulative (never resets)
  },

  // World progress
  worlds: [
    {
      id: 'egypt',
      unlocked: true,
      completed: false,
      starsEarned: 0,                     // 1–3 stars based on first-attempt %
      challengesCompleted: 0,
      currentRound: 1,                    // 1–3 (Explorer / Adventurer / Champion)
      roundXP: 0,                         // XP earned in the current round
    },
    // ... medieval, space, safari, india
    // completeCurrentRound() and startNextRound() helpers live in useGameState.js
  ],

  // The active challenge (null when not in challenge phase)
  currentChallenge: {
    worldId: 'egypt',
    challengeNumber: 1,                   // 1–4 (4 = boss)
    data: null,                           // ChallengeData from Claude (see below)
    attemptsLeft: 2,                      // Starts at 2, boss has 1
    selectedAnswer: null,
    isCorrect: null,
    hintShown: false,
    xpEarned: 0,
  },

  // Prefetched next challenge (populated during result screen to hide latency)
  nextChallenge: null,
  isLoadingChallenge: false,
  challengeError: null,
}
```

### ChallengeData shape (returned by Claude)

```js
{
  narrative: string,         // 2–3 sentence story setup
  challengeType: 'history' | 'math' | 'general' | 'science' | 'mixed' | 'boss',
  question: string,
  answerFormat: 'mcq' | 'number',
  options: string[],         // 4 items, only for mcq
  correctIndex: number,      // 0–3, only for mcq
  correctAnswer: string,     // Always present
  hint: string,              // One sentence, no spoilers
  reaction: string,          // Claude's response on correct answer
  funFact: string,           // Amazing fact to share
  xp: 100 | 200,            // 200 for boss only
}
```

---

## XP & Levelling

```
Correct, 1st attempt  → +100 XP  (or +200 for boss)
Correct, 2nd attempt  → +50 XP
Both attempts wrong   → +0 XP (but still shows fun fact)

Boss challenge is Q6 of Round 3 (not Q4).
XP is also tracked per-round via roundXP in game state (resets at the start of each round).

Level thresholds:
  1 — Apprentice   0–299 XP
  2 — Explorer     300–699 XP
  3 — Champion     700–1199 XP
  4 — Legend       1200+ XP

Star rating per world (based on first-attempt correct rate):
  3 stars → 4/4 or 3/4 correct first try
  2 stars → 2/4 correct first try
  1 star  → 1/4 or 0/4 correct first try
```

---

## World Configs

Each world in `src/worlds/index.js` exports:

```js
{
  id: 'egypt',
  name: 'Ancient Egypt',
  emoji: '🏺',
  accentColor: '#BA7517',    // Tailwind arbitrary or direct hex
  lightBg: '#FAEEDA',        // Question card background
  darkBg: '#7d3a00',         // World bar background
  textLight: '#FAEEDA',      // Text on darkBg
  textDark: '#412402',       // Text on lightBg
  borderColor: '#EF9F27',    // Accent borders
  Scene: EgyptScene,         // SVG scene component
  context: '...',            // Injected into Claude system prompt
}
```

---

## Claude API

### Endpoint

`POST /api/challenge` (Express proxy) → `POST https://api.anthropic.com/v1/messages`

The frontend never calls Anthropic directly. Always goes through the Express proxy.

### Prompt Architecture

`src/constants/prompts.js` exports `buildSystemPrompt({ hero, world, challengeNumber })`.

The system prompt:
- Sets Claude as a Game Master for a 7-year-old
- Injects heroName, heroClass, worldName, worldContext, challengeNumber
- Defines hero class voice guide (Warrior / Wizard / Explorer tone)
- Defines challenge type rules (history / math / general / boss)
- Enforces math difficulty (Grade 2–3: add/sub to 100, 2×/3×/5× tables only)
- Enforces strict JSON-only output (no markdown, no preamble)
- Defines narrative rules (2–3 sentences, second person, no scary violence)

The user message is always: `"Generate the challenge now. Return only valid JSON."`

### Latency Handling

Claude takes 2–3 seconds per call. To hide this:
- Prefetch challenge N+1 while the player is reading the result screen for challenge N
- Show a thematic loading animation if the prefetch isn't ready
- Never block on a call — always show loading state

Loading messages per world (fun, not generic):
- Egypt: "The Sphinx is thinking..."
- Medieval: "The wizard is consulting his scrolls..."
- Space: "Mission Control is calculating..."
- Safari: "The elder is preparing a riddle..."
- India: "The ancient scroll is being unrolled..."

---

## Design System

### Fonts

```css
/* Headings, world names, question text, number pad */
font-family: 'Fredoka One', cursive;

/* Body text, narrative, button labels, fun facts */
font-family: 'Nunito', sans-serif;
```

### Colours

Dark navy base for hero bar and landing: `#0d0f1a`
Gold accent for XP, hero name, landing title: `#f2cc60`
World colours are defined per-world in `src/worlds/index.js`

Button states:
- Default: `background: var(--color-bg-secondary)`, `border: 0.5px solid`
- Correct: green border + green bg (`#EAF3DE` / `#3B6D11`)
- Wrong: red border + red bg (`#FCEBEB` / `#A32D2D`)
- Continue CTA: `background: #534AB7` (always purple, world-agnostic)

### Scenes

Each `src/scenes/*.jsx` component returns ONLY an SVG element. No logic. No state.
These are purely decorative backdrop art.

When Claude Design generates these, scenes must:
- Use `width="100%"` and `viewBox="0 0 380 180"`
- Contain at least: sky treatment, 3+ world-specific elements, foreground terrain
- Use dark silhouette approach (elements are darker than the sky, not outlined)
- Include atmospheric depth: background haze, midground elements, foreground terrain
- Use NO gradients (layered opacity rects simulate gradient sky)
- Be iPad-safe: no hover interactions, no JS, pure SVG art only

---

## Component Rules

### Touch targets
All interactive elements: `min-height: 54px`, `min-width: 54px`
Answer buttons: at least `60px` tall on iPad

### No keyboard pop-up
Math answers use `NumberPad.jsx` (custom numpad).
The only keyboard input is the hero name field on HeroCreator — acceptable.

### Screen transitions
Each phase change should have a brief fade or slide transition.
Keep it snappy — under 300ms. Kids lose patience.

### Heart system
3 hearts per world (not per question).
Losing hearts: wrong on first attempt = lose 1 heart (not losing hearts on hint reveal).
0 hearts = world fails, can retry.

Wait — actually, per the spec, attempts are per-challenge (2 per question), not hearts
across the world. Hearts are visual only, showing challenges remaining.
Don't implement lives-across-world — too punishing for a 7-year-old.

---

## Build Order

Build in this order. Don't skip ahead.

Phases 1–5 complete as of 2026-05-31. See STATUS.md for detail.

```
Phase 1 — Project shell
  [ ] Vite + Tailwind + Express running together (npm run dev)
  [ ] App.jsx with phase switching (just console.log for now)
  [ ] HeroBar renders with hardcoded data

Phase 2 — All screens with hardcoded/mock data
  [ ] Landing screen
  [ ] HeroCreator (name + class)
  [ ] WorldMap (static, placeholder grey boxes for scenes)
  [ ] WorldEntry (hardcoded narrative text)
  [ ] ChallengeScreen → MCQInput + NumberPad (hardcoded question)
  [ ] ResultScreen (hardcoded correct state)
  [ ] WorldComplete
  [ ] GameComplete

Phase 3 — Wire Claude in
  [ ] server/index.js proxy working
  [ ] claude.js service
  [ ] buildSystemPrompt() in prompts.js
  [ ] useChallenge hook — fetch + prefetch
  [ ] Live questions flowing through all worlds

Phase 4 — Game logic
  [ ] useGameState — XP, levelling, world unlocking, star rating
  [ ] Heart/attempts system
  [ ] Wrong answer → hint → second attempt flow
  [ ] World complete unlock animation on map

Phase 5 — Scene art (Claude Design)
  [ ] EgyptScene.jsx
  [ ] MedievalScene.jsx
  [ ] SpaceScene.jsx
  [ ] SafariScene.jsx
  [ ] IndiaScene.jsx

Phase 6 — Polish
  [ ] Screen transition animations (CSS, not a library)
  [ ] XP bar fill animation
  [ ] Level-up celebration
  [ ] Loading animations per world
  [ ] iPad viewport meta + touch behaviour
```

---

## Code Quality Rules (Sonar-enforced)

These rules are checked by SonarQube on every push. Violations block the quality gate.

### PropTypes — every component must declare them

Every React component that accepts props **must** declare `PropTypes` at the bottom of the file.

```js
import PropTypes from 'prop-types'

MyComponent.propTypes = {
  world: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onContinue: PropTypes.func.isRequired,
}
```

Rules:
- Import `prop-types` at the top of the file.
- Declare `.propTypes` **after** the function definition, not inside it.
- Mark required props with `.isRequired`.
- Use `PropTypes.shape({})` for object props — list every field the component actually reads.
- Sub-shapes (e.g. `currentChallenge.data.challengeType`) must be nested inside their parent shape.
- Components that accept no props need no `propTypes` declaration.

### Array keys — never use the index variable

Sonar flags `key={i}` or `key={index}` when the variable is the `.map()` index parameter.

**Wrong:**
```js
items.map((item, i) => <div key={i} />)
```

**Right — use a stable ID from the data:**
```js
items.map(item => <div key={item.id} />)
```

**Right — if there is no natural ID, build a descriptive string key up front:**
```js
Array.from({ length: n }, (_, i) => `dot-${i + 1}`).map(key => <span key={key} />)
```

Never use a raw index parameter as a JSX key, even wrapped in a string template that still references the parameter as its sole content.

### Nested ternaries — extract to a variable or function

Sonar flags chained ternaries like `a ? b : c ? d : e`.

**Wrong:**
```js
const label = level === 1 ? 'Apprentice' : level === 2 ? 'Explorer' : 'Champion'
```

**Right — use a lookup object:**
```js
const LEVEL_LABEL = { 1: 'Apprentice', 2: 'Explorer', 3: 'Champion' }
const label = LEVEL_LABEL[level] ?? 'Champion'
```

**Right — use an explicit `if` block or extracted function:**
```js
function getLabel(level) {
  if (level === 1) return 'Apprentice'
  if (level === 2) return 'Explorer'
  return 'Champion'
}
```

Single-level ternaries (`a ? b : c`) are fine. Two or more levels are not.

### Cognitive complexity — keep functions simple

Sonar allows a maximum cognitive complexity of **15** per function. `buildSystemPrompt()` previously hit 69 by embedding all branching logic inline.

Rules:
- Extract each distinct "block" of conditional text into its own named function or constant.
- A function that assembles a template string should do no branching itself — call helpers that already resolved the branches.
- Lookup objects (`{ 1: '...', 2: '...' }`) are zero complexity; `if/else` chains and ternaries each add to the score.

### Function nesting depth — max 4 levels

Sonar flags functions nested more than 4 levels deep (function → callback → callback → callback → callback).

This commonly appears in `setWorldStates(prev => prev.map(w => w.rounds.map(r => ...)))`.

**Fix:** extract the inner transform as a named top-level function and call it from the setter callback:

```js
function applyRoundUpdate(worldStates, worldId, roundNumber) {
  return worldStates.map(w => {
    if (w.id !== worldId) return w
    return { ...w, rounds: w.rounds.map(r => r.number === roundNumber ? { ...r, completed: true } : r) }
  })
}

// Inside the hook:
setWorldStates(prev => applyRoundUpdate(prev, activeWorldId, currentRound))
```

### Default parameters over null-coalescing reassignment

**Wrong:**
```js
function foo(x) {
  const val = x ?? 'default'
  ...
}
```

**Right:**
```js
function foo(x = 'default') {
  ...
}
```

---

## What NOT To Do

- **Don't add react-router.** Phase-based state switching is intentional and simpler.
- **Don't add a database.** Progress lives in React state (session only). If Madhav closes the browser, the game resets. That's fine.
- **Don't add a timer.** Madhav is 7. Let him think. No pressure timers.
- **Don't abstract too early.** Write the Egypt challenge flow concretely, then extract patterns for other worlds.
- **Don't hardcode questions.** Every question must come from Claude. No fallback question banks.
- **Don't make it scary.** Danger is dramatic and exciting. Nobody dies. Nobody loses. Wrong answers just trigger a hint.
- **Don't use gradients in scene SVGs.** Layer opacity rects instead — they render correctly on all devices.
- **Don't expose ANTHROPIC_API_KEY in the client bundle.** It goes in .env, stays on the server.

---

## Running Locally

```bash
# Install
npm install

# Add your key
cp .env.example .env
# Edit .env: ANTHROPIC_API_KEY=sk-ant-...

# Run (starts Vite + Express together)
npm run dev

# On iPad: open Safari, go to http://[your-mac-local-ip]:5173
```

---

## Key Decisions & Why

| Decision | Rationale |
|----------|-----------|
| Express proxy | API key must not be in the browser bundle |
| Phase-based routing | Simpler than react-router for a linear game flow |
| MCQ for history/general | No frustrating free-text input for a 7-year-old |
| Number pad for maths | No iOS keyboard pop-up shifting the layout |
| 2 attempts per question | Educational — always see the right answer, but XP penalty for wrong |
| No timer | Exploration over pressure for this age |
| Prefetch next challenge | Hides Claude's 2–3s latency — seamless feel |
| Session-only state | No backend needed, no sign-in friction for a kid |
| India as final world | Cultural connection + mathematical hook (invention of zero) |
