import { useState } from 'react'
import worlds from '../worlds/index.js'


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

  function enterWorld(challengeData) {
    setChallengeIndex(0)
    setCurrentChallenge({
      worldId: activeWorldId,
      challengeNumber: 1,
      data: challengeData,
      attemptsLeft: challengeData.challengeType === 'boss' ? 1 : 2,
      selectedAnswer: null,
      isCorrect: null,
      hintShown: false,
      xpEarned: 0,
    })
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

  const TOTAL_CHALLENGES = 4

  function continueFromResult(nextChallengeData) {
    setHeroState(h => ({ ...h, levelledUp: false }))

    const nextIndex = challengeIndex + 1

    if (nextIndex >= TOTAL_CHALLENGES) {
      // World complete
      const ws = worldStates.find(w => w.id === activeWorldId)
      const firstAttemptCount = ws?.firstAttemptCorrect ?? 0
      const stars = firstAttemptCount >= 3 ? 3 : firstAttemptCount >= 2 ? 2 : 1

      setWorldStates(prev => {
        const updated = prev.map(w => {
          if (w.id === activeWorldId) {
            return { ...w, completed: true, starsEarned: stars, challengesCompleted: TOTAL_CHALLENGES }
          }
          return w
        })
        const currentIdx = worlds.findIndex(w => w.id === activeWorldId)
        if (currentIdx + 1 < worlds.length) {
          updated[currentIdx + 1] = { ...updated[currentIdx + 1], unlocked: true }
        }
        return updated
      })

      setPhase('world-complete')
    } else {
      setChallengeIndex(nextIndex)
      setCurrentChallenge({
        worldId: activeWorldId,
        challengeNumber: nextIndex + 1,
        data: nextChallengeData,
        attemptsLeft: nextChallengeData.challengeType === 'boss' ? 1 : 2,
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
