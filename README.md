# 🌍 World Quest

**A Claude-powered educational RPG for curious kids — built with love for one very specific 7-year-old.**

![World Quest Screenshot](docs/screenshot.png)

---

## What is this?

World Quest is a browser-based educational RPG built for Madhav, a 7-year-old, to play on an iPad. The player picks a hero, travels through 5 themed worlds spanning ancient history and outer space, and answers questions about maths, history, and general knowledge. Every question, narrative, and fun fact is generated on the fly by Claude — no static question banks, ever.

This is a personal family project. It is not a product. It prioritises fun, polish, and kid-friendliness above everything else.

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/hawkeye-ailearn/world-adventure.git
cd world-adventure

# 2. Install dependencies
npm install

# 3. Add your Anthropic API key
cp .env.example .env
# Open .env and set: ANTHROPIC_API_KEY=sk-ant-...

# 4. Start the dev server (Vite + Express together)
npm run dev

# 5. Open the game
#    Browser:  http://localhost:5173
#    iPad:     http://[your-local-ip]:5173  (same Wi-Fi network)
```

That's it. No database. No sign-in. No build step needed for local play.

---

## Project Structure

```
world-adventure/
├── CLAUDE.md                       ← Project brief, design rules, build order
├── STATUS.md                       ← Current build phase progress
├── PROGRESS.md                     ← Session-by-session dev log
├── DECISIONS.md                    ← Architectural decision record
├── KNOWN_ISSUES.md                 ← Bugs and known limitations
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
│   ├── scenes/                     ← SVG backdrop art, one per world
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
├── api/
│   └── challenge.js                ← Vercel serverless function (production)
├── docs/
│   └── screenshot.png              ← Screenshot for this README
├── .env                            ← ANTHROPIC_API_KEY=... (never commit)
├── .env.example                    ← Template (safe to commit)
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## The 5 Worlds

| World | Emoji | Subjects |
|-------|-------|----------|
| Ancient Egypt | 🏺 | Egyptian history, maths (addition & multiplication), hieroglyphs |
| Medieval Europe | 🏰 | Medieval history, castles & knights, general knowledge |
| Outer Space | 🚀 | Space science, planets & stars, maths (large numbers) |
| African Safari | 🦁 | Wildlife & ecology, African geography, general knowledge |
| Ancient India | 🪔 | Indian history, invention of zero, maths (the hardest world!) |

Each world has 4 challenges: 3 regular questions and 1 boss challenge worth double XP.

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | React 18 + Vite | Fast dev, clean build |
| Styling | Tailwind CSS | World-specific theming via Tailwind vars |
| State | useState + Context | No Redux — game state is simple enough |
| Backend | Express.js (1 file) | API proxy only — keeps the key off the client |
| AI | Claude claude-sonnet-4-20250514 | Via /v1/messages, strict JSON-mode prompting |
| Fonts | Fredoka One + Nunito | Loaded from Google Fonts CDN |

The Express server runs on port 3001 locally. In dev, Vite proxies `/api → 3001`. In production, `/api/challenge.js` is a Vercel serverless function that does the same job.

---

## Running Tests

```bash
# Watch mode (during development)
npm run test

# Single run (used in CI)
npm run test:run

# Coverage report
npm run coverage
```

---

## Deployment

### Local (family iPad play)
```bash
npm run dev
```
This starts Vite (port 5173) and Express (port 3001) together. Open Safari on the iPad and go to `http://[mac-local-ip]:5173`. No internet required — just the same Wi-Fi network.

### Production (Vercel)
The project deploys automatically to Vercel via GitHub Actions on every push to `main`.

- The Express server (`server/index.js`) is **local only** — Vercel doesn't use it.
- Instead, `api/challenge.js` is a Vercel serverless function that handles the `/api/challenge` route in production.
- Vercel serves the Vite build as a static site and routes `/api/*` to the serverless function automatically.

**Before first deploy**, add your API key in Vercel:
> Vercel dashboard → Project → Settings → Environment Variables → Add `ANTHROPIC_API_KEY`

---

## Environment Variables

| Variable | What it does | Where to get it |
|----------|-------------|-----------------|
| `ANTHROPIC_API_KEY` | Authenticates calls to the Claude API | [console.anthropic.com](https://console.anthropic.com) → API Keys |

That's the only one. Copy `.env.example` to `.env` and fill it in.

---

## Status

See [STATUS.md](STATUS.md) for current build progress.
