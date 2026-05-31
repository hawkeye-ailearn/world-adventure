import HeroBar from './HeroBar.jsx'
import { ROUND_NAMES } from '../utils/rounds.js'

function StarDrop({ index, filled, accentColor }) {
  return (
    <span
      className="animate-popIn"
      style={{
        fontSize: 36,
        opacity: filled ? 1 : 0.25,
        filter: filled ? `drop-shadow(0 2px 8px ${accentColor}88)` : 'none',
        animationDelay: `${index * 120}ms`,
        display: 'inline-block',
      }}
    >
      ⭐
    </span>
  )
}

export default function RoundComplete({
  world,
  hero,
  roundNumber,
  starsEarned,
  xpEarnedThisRound,
  onContinue,
}) {
  const nextRound = roundNumber + 1
  const nextRoundName = ROUND_NAMES[nextRound - 1]
  const isLastRound = roundNumber === 3

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden animate-slideUp"
      style={{ background: world.lightBg }}
    >
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

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
        {/* Round complete badge */}
        <div
          className="w-full rounded-3xl flex flex-col items-center py-6 px-4 gap-3"
          style={{
            background: 'white',
            border: `3px solid ${world.accentColor}`,
          }}
        >
          <span style={{ fontSize: 48 }}>🏅</span>
          <p
            className="font-fredoka text-center"
            style={{ color: world.textDark, fontSize: 24 }}
          >
            {ROUND_NAMES[roundNumber - 1]} Round Complete!
          </p>
          <p
            className="font-nunito text-sm text-center"
            style={{ color: world.textDark, opacity: 0.7 }}
          >
            {hero.name}, you conquered Round {roundNumber} of {world.name}!
          </p>

          {/* Stars */}
          <div className="flex gap-2 mt-1">
            {[1, 2, 3].map(n => (
              <StarDrop
                key={n}
                index={n - 1}
                filled={n <= starsEarned}
                accentColor={world.accentColor}
              />
            ))}
          </div>
        </div>

        {/* XP earned */}
        {xpEarnedThisRound > 0 && (
          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-3 w-full"
            style={{ background: '#1e2440', border: '1.5px solid #f2cc6066' }}
          >
            <span style={{ fontSize: 24 }}>✨</span>
            <span className="font-fredoka text-xl" style={{ color: '#f2cc60' }}>
              +{xpEarnedThisRound} XP this round
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

        {/* Next round preview (only if not last round) */}
        {!isLastRound && (
          <div
            className="w-full rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: world.darkBg + '33', border: `1.5px solid ${world.borderColor}` }}
          >
            <span style={{ fontSize: 24 }}>⚡</span>
            <div>
              <p className="font-fredoka" style={{ color: world.textDark, fontSize: 15 }}>
                Up Next: Round {nextRound} — {nextRoundName}
              </p>
              <p className="font-nunito text-xs" style={{ color: world.textDark, opacity: 0.65 }}>
                5 more challenges, harder difficulty
              </p>
            </div>
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="w-full font-fredoka rounded-2xl mt-auto"
          style={{
            background: world.accentColor,
            color: world.textDark,
            fontSize: 20,
            padding: '16px',
            minHeight: 60,
            border: 'none',
            cursor: 'pointer',
            boxShadow: `0 4px 20px ${world.accentColor}55`,
          }}
        >
          {isLastRound ? `Complete ${world.name}! 🏆` : `Round ${nextRound} — ${nextRoundName} →`}
        </button>
      </div>
    </div>
  )
}
