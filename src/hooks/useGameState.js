import { useState } from 'react'
import worlds from '../worlds/index.js'


const TITLES = [
  { min: 0,    max: 299,  title: 'Apprentice',  level: 1 },
  { min: 300,  max: 699,  title: 'Explorer',    level: 2 },
  { min: 700,  max: 1199, title: 'Champion',    level: 3 },
  { min: 1200, max: Infinity, title: 'Legend',  level: 4 },
]

const ROUND_NAMES = ['Explorer', 'Adventurer', 'Champion']

const CHALLENGES_PER_ROUND = 5   // rounds 1+2: 5 challenges
const BOSS_ROUND = 3              // round 3 has 6 (5 + boss)

function totalChallengesInRound(roundNumber) {
  return roundNumber === BOSS_ROUND ? 6 : CHALLENGES_PER_ROUND
}

function getTitleForXP(xp) {
  return TITLES.find(t => xp >= t.min && xp <= t.max) ?? TITLES[0]
}

function buildRounds() {
  return ROUND_NAMES.map((name, i) => ({
    number: i + 1,
    name,
    completed: false,
    starsEarned: 0,
    firstAttemptCorrect: 0,
  }))
}

function buildWorldState() {
  return worlds.map((w, i) => ({
    id: w.id,
    unlocked: i === 0,
    completed: false,
    currentRound: 1,
    rounds: buildRounds(),
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
  const [currentRound, setCurrentRound] = useState(1)
  const [roundXP, setRoundXP] = useState(0)

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
    setCurrentRound(ws.currentRound)
    setPhase('world-entry')
  }

  function enterWorld(challengeData) {
    setChallengeIndex(0)
    setRoundXP(0)
    setCurrentChallenge({
      worldId: activeWorldId,
      challengeNumber: 1,
      roundNumber: currentRound,
      roundName: ROUND_NAMES[currentRound - 1],
      totalChallengesInRound: totalChallengesInRound(currentRound),
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
      // Track first-attempt correct for star rating — on the current round
      if (isFirstAttempt) {
        setWorldStates(ws =>
          ws.map(w =>
            w.id === activeWorldId
              ? {
                  ...w,
                  rounds: w.rounds.map(r =>
                    r.number === currentRound
                      ? { ...r, firstAttemptCorrect: r.firstAttemptCorrect + 1 }
                      : r
                  ),
                }
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

      // Accumulate round XP
      setRoundXP(r => r + xpEarned)

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

  function continueFromResult(nextChallengeData) {
    setHeroState(h => ({ ...h, levelledUp: false }))

    const nextIndex = challengeIndex + 1
    const maxForRound = totalChallengesInRound(currentRound)

    if (nextIndex >= maxForRound) {
      // Round complete — calculate stars
      completeCurrentRound()
    } else {
      setChallengeIndex(nextIndex)
      setCurrentChallenge({
        worldId: activeWorldId,
        challengeNumber: nextIndex + 1,
        roundNumber: currentRound,
        roundName: ROUND_NAMES[currentRound - 1],
        totalChallengesInRound: totalChallengesInRound(currentRound),
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

  function completeCurrentRound() {
    setWorldStates(prev => {
      const updated = prev.map(w => {
        if (w.id !== activeWorldId) return w
        const roundIdx = w.rounds.findIndex(r => r.number === currentRound)
        const round = w.rounds[roundIdx]
        const firstAttemptCount = round.firstAttemptCorrect
        const stars = firstAttemptCount >= 4 ? 3 : firstAttemptCount >= 3 ? 2 : 1
        const updatedRounds = w.rounds.map((r, i) =>
          i === roundIdx ? { ...r, completed: true, starsEarned: stars } : r
        )

        if (currentRound < 3) {
          // Not the last round — advance currentRound
          return { ...w, rounds: updatedRounds, currentRound: currentRound + 1 }
        } else {
          // Last round — world complete, unlock next
          return { ...w, rounds: updatedRounds, completed: true }
        }
      })

      if (currentRound === 3) {
        // Unlock next world
        const currentIdx = worlds.findIndex(w => w.id === activeWorldId)
        if (currentIdx + 1 < worlds.length) {
          updated[currentIdx + 1] = { ...updated[currentIdx + 1], unlocked: true }
        }
      }

      return updated
    })

    if (currentRound < 3) {
      setCurrentRound(r => r + 1)
      setPhase('round-complete')
    } else {
      setPhase('world-complete')
    }
  }

  function startNextRound() {
    setChallengeIndex(0)
    setRoundXP(0)
    setCurrentChallenge(null)
    setPhase('world-entry')
  }

  function getCompletedRoundStars() {
    const ws = worldStates.find(w => w.id === activeWorldId)
    if (!ws) return 0
    // When phase is 'round-complete', currentRound has already been incremented
    // so the just-completed round is currentRound - 1.
    // When phase is 'world-complete', round 3 just finished; currentRound is still 3.
    const rNum = phase === 'world-complete' ? 3 : currentRound - 1
    const round = ws.rounds.find(r => r.number === rNum)
    return round?.starsEarned ?? 0
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
    currentRound,
    roundXP,
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
    startNextRound,
    returnToMap,
    // Helpers
    getActiveWorld,
    getWorldState,
    getNextWorld,
    getCompletedRoundStars,
    totalChallengesInRound,
  }
}
