import { useEffect, useRef, useState } from 'react'
import HeroBar from './HeroBar.jsx'
import useChallenge from '../hooks/useChallenge.js'

export default function ResultScreen({ hero, world, currentChallenge, onContinue }) {
  const { data, isCorrect, xpEarned } = currentChallenge
  const isBoss = data.challengeType === 'boss'

  const { prefetchNext, fetchChallenge } = useChallenge()
  const prefetchPromise = useRef(null)
  const [isPreparing, setIsPreparing] = useState(false)

  useEffect(() => {
    const nextNum = currentChallenge.challengeNumber + 1
    const maxForRound = currentChallenge.roundNumber === 3 ? 6 : 5
    if (nextNum <= maxForRound) {
      prefetchPromise.current = prefetchNext({
        hero,
        worldId: world.id,
        roundNumber: currentChallenge.roundNumber,
        nextChallengeNumber: nextNum,
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleContinue() {
    const maxForRound = currentChallenge.roundNumber === 3 ? 6 : 5
    if (currentChallenge.challengeNumber >= maxForRound) {
      onContinue(null)
      return
    }
    setIsPreparing(true)
    let nextData = await prefetchPromise.current
    if (!nextData) {
      // Prefetch failed — fall back to a fresh fetch
      try {
        nextData = await fetchChallenge({
          hero,
          worldId: world.id,
          roundNumber: currentChallenge.roundNumber,
          challengeNumber: currentChallenge.challengeNumber + 1,
        })
      } catch {
        setIsPreparing(false)
        return // stay on result screen; player can tap Continue to retry
      }
    }
    setIsPreparing(false)
    onContinue(nextData)
  }

  const isFirstAttempt = isCorrect && xpEarned === data.xp

  const state = isCorrect ? (isFirstAttempt ? 'A' : 'B') : 'C'

  const resultConfig = {
    A: {
      icon: isBoss ? '🏆' : '⭐',
      iconSize: 56,
      bg: '#EAF3DE',
      border: '#3B6D11',
      textColor: '#3B6D11',
      heading: `Brilliant, ${hero.name}!`,
      message: data.reaction,
    },
    B: {
      icon: '✅',
      iconSize: 44,
      bg: '#EAF3DE',
      border: '#3B6D11',
      textColor: '#3B6D11',
      heading: `Well done, ${hero.name}!`,
      message: data.reaction,
    },
    C: {
      icon: '📖',
      iconSize: 44,
      bg: '#FFF8E7',
      border: '#D4A017',
      textColor: '#7a5c00',
      heading: `Here's what the answer was, ${hero.name}...`,
      message: null,
    },
  }[state]

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden animate-slideUp"
      style={{ background: world.lightBg }}
    >
      {/* Hero bar */}
      <HeroBar hero={hero} />

      {/* World bar */}
      <div
        className="flex items-center gap-3 px-4 py-2 shrink-0"
        style={{ background: world.darkBg, minHeight: 44 }}
      >
        <span className="text-xl">{world.emoji}</span>
        <span className="font-fredoka" style={{ color: world.textLight, fontSize: 16 }}>
          {world.name}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col items-center px-5 py-4 gap-4">

        {/* Result badge */}
        <div
          className="w-full rounded-3xl flex flex-col items-center py-5 px-4 gap-2"
          style={{
            background: resultConfig.bg,
            border: `3px solid ${resultConfig.border}`,
          }}
        >
          <span style={{ fontSize: resultConfig.iconSize }}>{resultConfig.icon}</span>
          <p
            className="font-fredoka text-center"
            style={{ color: resultConfig.textColor, fontSize: 22 }}
          >
            {resultConfig.heading}
          </p>
          {resultConfig.message && (
            <p className="font-nunito text-sm text-center" style={{ color: resultConfig.textColor, opacity: 0.85 }}>
              {resultConfig.message}
            </p>
          )}
          {state === 'C' && (
            <div
              className="mt-2 px-4 py-2 rounded-xl font-nunito font-bold text-center text-sm"
              style={{ background: 'white', border: `1.5px solid ${world.borderColor}`, color: world.textDark }}
            >
              ✅ {data.correctAnswer}
            </div>
          )}
        </div>

        {/* XP earned */}
        {xpEarned > 0 && (
          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-3 w-full"
            style={{
              background: '#1e2440',
              border: `1.5px solid ${state === 'A' ? '#f2cc6066' : '#aaaaaa44'}`,
            }}
          >
            <span style={{ fontSize: 24 }}>{state === 'A' ? '✨' : '⚡'}</span>
            <span
              className="font-fredoka text-xl"
              style={{ color: state === 'A' ? '#f2cc60' : '#c0c8d8' }}
            >
              +{xpEarned} XP
            </span>
            <span className="font-nunito text-sm ml-auto" style={{ color: '#8899bb' }}>
              {hero.totalXP} total
            </span>
          </div>
        )}

        {/* Level-up banner */}
        {hero.levelledUp && (
          <div
            className="w-full rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: '#2a1060', border: '2px solid #a855f7' }}
          >
            <span style={{ fontSize: 28 }}>🎉</span>
            <div>
              <p className="font-fredoka" style={{ color: '#e9d5ff', fontSize: 18 }}>
                Level Up!
              </p>
              <p className="font-nunito text-sm" style={{ color: '#c4b5fd' }}>
                You are now a <strong>{hero.title}</strong>!
              </p>
            </div>
          </div>
        )}

        {/* Fun fact */}
        <div
          className="rounded-2xl px-4 py-4 w-full flex gap-3 items-start"
          style={{ background: 'white', border: `1.5px solid ${world.borderColor}` }}
        >
          <span className="text-2xl shrink-0">💡</span>
          <div>
            <p className="font-fredoka mb-1" style={{ color: world.textDark, fontSize: 15 }}>Fun Fact!</p>
            <p className="font-nunito text-sm leading-relaxed" style={{ color: world.textDark, opacity: 0.8 }}>
              {data.funFact}
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-col gap-3 w-full mt-auto">
          <button
            onClick={handleContinue}
            disabled={isPreparing}
            className="w-full font-fredoka rounded-2xl"
            style={{
              background: isPreparing ? '#8880cc' : '#534AB7',
              color: 'white',
              fontSize: 20,
              padding: '16px',
              minHeight: 60,
              border: 'none',
              cursor: isPreparing ? 'not-allowed' : 'pointer',
              boxShadow: isPreparing ? 'none' : '0 4px 20px #534AB755',
              opacity: isPreparing ? 0.75 : 1,
            }}
          >
            {isPreparing ? world.loadingMessage : (state === 'C' ? 'Keep going →' : 'Continue →')}
          </button>
        </div>
      </div>
    </div>
  )
}
