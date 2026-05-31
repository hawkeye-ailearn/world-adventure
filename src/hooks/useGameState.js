import { useState } from 'react'
import worlds from '../worlds/index.js'

// Mock challenges used in Phase 2 (Claude API not wired yet)
const MOCK_CHALLENGES = [
  {
    narrative:
      "You stand before the Great Pyramid of Giza! The ancient stones shimmer in the desert sun. A temple guardian steps forward with a question!",
    challengeType: 'history',
    question: "Who built the Great Pyramid of Giza?",
    answerFormat: 'mcq',
    options: ['Ramesses II', 'Khufu', 'Tutankhamun', 'Cleopatra'],
    correctIndex: 1,
    correctAnswer: 'Khufu',
    hint: "He was a pharaoh of the 4th dynasty — his name means 'protected by Khnum'.",
    reaction: "Outstanding! You really know your pharaohs!",
    funFact: "The Great Pyramid of Giza was built around 2560 BC and is the only surviving Wonder of the Ancient World!",
    xp: 100,
  },
  {
    narrative:
      "The pyramid builders need your help counting stone blocks! The head architect looks at you with hopeful eyes.",
    challengeType: 'math',
    question: "How much is 24 + 37?",
    answerFormat: 'number',
    options: [],
    correctIndex: null,
    correctAnswer: '61',
    hint: "Try adding the tens first: 20 + 30 = 50, then add the ones.",
    reaction: "Brilliant! You're a maths master!",
    funFact: "The ancient Egyptians invented one of the earliest decimal number systems over 5,000 years ago!",
    xp: 100,
  },
  {
    narrative:
      "Deep inside a tomb, hieroglyphics glow on every wall. An ancient spirit guards the treasure with one last riddle!",
    challengeType: 'general',
    question: "What gift did the Nile give to Ancient Egypt every year?",
    answerFormat: 'mcq',
    options: ['Melting snow from mountains', 'Rich fertile soil from flooding', 'Golden nuggets', 'Cool river breezes'],
    correctIndex: 1,
    correctAnswer: 'Rich fertile soil from flooding',
    hint: "Think about what a river leaves behind when its waters go back down.",
    reaction: "Excellent! The Nile was the lifeblood of all Egypt!",
    funFact: "The Nile's annual flood left behind rich dark soil called silt — so fertile that Egypt became the breadbasket of the ancient world!",
    xp: 100,
  },
  {
    narrative:
      "The mighty Sphinx rises from the sand! Its eyes open for the first time in centuries. This is the BOSS CHALLENGE — prove you are worthy!",
    challengeType: 'boss',
    question: "How many faces does a pyramid have in total (including the base)?",
    answerFormat: 'mcq',
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    correctAnswer: '5',
    hint: "Count the triangular sides AND the flat bottom — they're all faces!",
    reaction: "LEGENDARY! The Sphinx bows before your incredible knowledge!",
    funFact: "A square pyramid has 4 triangular faces plus 1 square base = 5 faces total. In maths this is called a square pyramid polyhedron!",
    xp: 200,
  },
]

const TITLES = [
  { min: 0,    max: 299,  title: 'Apprentice',  level: 1 },
  { min: 300,  max: 699,  title: 'Explorer',    level: 2 },
  { min: 700,  max: 1199, title: 'Champion',    level: 3 },
  { min: 1200, max: Infinity, title: 'Legend',  level: 4 },
]

function getTitleForXP(xp) {
  return TITLES.find(t => xp >= t.min && xp <= t.max) ?? TITLES[0]
}

function buildWorldState() {
  return worlds.map((w, i) => ({
    id: w.id,
    unlocked: i === 0,
    completed: false,
    starsEarned: 0,
    challengesCompleted: 0,
    firstAttemptCorrect: 0,
    xpEarned: 0,
  }))
}

export default function useGameState() {
  const [phase, setPhase] = useState('landing')
  const [hero, setHeroState] = useState({
    name: '',
    class: 'warrior',
    level: 1,
    title: 'Apprentice',
    xp: 0,
    totalXP: 0,
    levelledUp: false,
  })
  const [worldStates, setWorldStates] = useState(buildWorldState())
  const [activeWorldId, setActiveWorldId] = useState('egypt')
  const [currentChallenge, setCurrentChallenge] = useState(null)
  const [challengeIndex, setChallengeIndex] = useState(0)

  // --- Navigation ---

  function startGame() {
    setPhase('hero-creator')
  }

  function createHero({ name, heroClass }) {
    setHeroState(h => ({ ...h, name, class: heroClass }))
    setPhase('world-map')
  }

  function selectWorld(worldId) {
    const ws = worldStates.find(w => w.id === worldId)
    if (!ws?.unlocked) return
    setActiveWorldId(worldId)
    setChallengeIndex(0)
    setPhase('world-entry')
  }

  function enterWorld() {
    const challenge = MOCK_CHALLENGES[0]
    setCurrentChallenge({
      worldId: activeWorldId,
      challengeNumber: 1,
      data: challenge,
      attemptsLeft: challenge.challengeType === 'boss' ? 1 : 2,
      selectedAnswer: null,
      isCorrect: null,
      hintShown: false,
      xpEarned: 0,
    })
    setChallengeIndex(0)
    setPhase('challenge')
  }

  function submitAnswer(answer) {
    if (!currentChallenge) return
    const { data, attemptsLeft } = currentChallenge

    const isCorrect =
      data.answerFormat === 'mcq'
        ? parseInt(answer) === data.correctIndex
        : String(answer).trim() === String(data.correctAnswer).trim()

    const isBoss = data.challengeType === 'boss'
    const maxAttempts = isBoss ? 1 : 2
    const isFirstAttempt = attemptsLeft === maxAttempts
    const xpEarned = isCorrect ? (isFirstAttempt ? data.xp : Math.floor(data.xp / 2)) : 0

    if (isCorrect) {
      // Track first-attempt correct for star rating
      if (isFirstAttempt) {
        setWorldStates(ws =>
          ws.map(w =>
            w.id === activeWorldId
              ? { ...w, firstAttemptCorrect: w.firstAttemptCorrect + 1 }
              : w
          )
        )
      }

      // Award XP and recalculate level
      setHeroState(h => {
        const newTotal = h.totalXP + xpEarned
        const rank = getTitleForXP(newTotal)
        const levelledUp = rank.level > h.level
        return { ...h, xp: h.xp + xpEarned, totalXP: newTotal, level: rank.level, title: rank.title, levelledUp }
      })

      // Track XP earned this world
      setWorldStates(ws =>
        ws.map(w =>
          w.id === activeWorldId
            ? { ...w, xpEarned: w.xpEarned + xpEarned }
            : w
        )
      )

      setCurrentChallenge({
        ...currentChallenge,
        selectedAnswer: answer,
        isCorrect: true,
        xpEarned,
        attemptsLeft,
      })
      setPhase('result')
    } else {
      const newAttemptsLeft = attemptsLeft - 1

      if (newAttemptsLeft > 0 && !isBoss) {
        // Wrong on first attempt — stay on challenge, auto-show hint
        setCurrentChallenge({
          ...currentChallenge,
          selectedAnswer: answer,
          isCorrect: false,
          attemptsLeft: newAttemptsLeft,
          hintShown: true,
          xpEarned: 0,
        })
        // Stay on 'challenge' phase — no setPhase call
      } else {
        // All attempts exhausted (or boss) — go to result
        setCurrentChallenge({
          ...currentChallenge,
          selectedAnswer: answer,
          isCorrect: false,
          attemptsLeft: 0,
          xpEarned: 0,
        })
        setPhase('result')
      }
    }
  }

  function showHint() {
    setCurrentChallenge(cc => cc ? { ...cc, hintShown: true } : cc)
  }

  function continueFromResult() {
    // Clear level-up flag for next challenge
    setHeroState(h => ({ ...h, levelledUp: false }))

    const nextIndex = challengeIndex + 1

    if (nextIndex >= MOCK_CHALLENGES.length) {
      // World complete
      const ws = worldStates.find(w => w.id === activeWorldId)
      const firstAttemptCount = ws?.firstAttemptCorrect ?? 0
      const stars = firstAttemptCount >= 3 ? 3 : firstAttemptCount >= 2 ? 2 : 1

      setWorldStates(prev => {
        const updated = prev.map(w => {
          if (w.id === activeWorldId) {
            return { ...w, completed: true, starsEarned: stars, challengesCompleted: MOCK_CHALLENGES.length }
          }
          return w
        })
        // Unlock next world
        const currentIdx = worlds.findIndex(w => w.id === activeWorldId)
        if (currentIdx + 1 < worlds.length) {
          updated[currentIdx + 1] = { ...updated[currentIdx + 1], unlocked: true }
        }
        return updated
      })

      setPhase('world-complete')
    } else {
      // Next challenge
      const challenge = MOCK_CHALLENGES[nextIndex]
      setChallengeIndex(nextIndex)
      setCurrentChallenge({
        worldId: activeWorldId,
        challengeNumber: nextIndex + 1,
        data: challenge,
        attemptsLeft: challenge.challengeType === 'boss' ? 1 : 2,
        selectedAnswer: null,
        isCorrect: null,
        hintShown: false,
        xpEarned: 0,
      })
      setPhase('challenge')
    }
  }

  function returnToMap() {
    const allComplete = worldStates.every(w => w.completed)
    if (allComplete) {
      setPhase('game-complete')
    } else {
      setPhase('world-map')
    }
  }

  function getActiveWorld() {
    return worlds.find(w => w.id === activeWorldId)
  }

  function getWorldState(worldId) {
    return worldStates.find(w => w.id === worldId)
  }

  function getNextWorld() {
    const currentIdx = worlds.findIndex(w => w.id === activeWorldId)
    return currentIdx + 1 < worlds.length ? worlds[currentIdx + 1] : null
  }

  return {
    phase,
    hero,
    worlds,
    worldStates,
    activeWorldId,
    currentChallenge,
    challengeIndex,
    // Actions
    startGame,
    createHero,
    selectWorld,
    enterWorld,
    submitAnswer,
    showHint,
    continueFromResult,
    returnToMap,
    // Helpers
    getActiveWorld,
    getWorldState,
    getNextWorld,
  }
}
