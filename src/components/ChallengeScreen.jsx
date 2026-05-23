import HeroBar from './HeroBar.jsx'
import MCQInput from './MCQInput.jsx'
import NumberPad from './NumberPad.jsx'

const CHALLENGE_LABELS = {
  1: { label: 'History',      icon: '📜' },
  2: { label: 'Maths',        icon: '🔢' },
  3: { label: 'General',      icon: '🌍' },
  4: { label: 'BOSS',         icon: '👾' },
}

export default function ChallengeScreen({ hero, world, currentChallenge, onAnswer, onShowHint }) {
  const { data, challengeNumber, attemptsLeft, hintShown } = currentChallenge
  const { Scene } = world
  const isBoss = challengeNumber === 4
  const meta = CHALLENGE_LABELS[challengeNumber] ?? { label: 'Challenge', icon: '❓' }

  // Hearts = attemptsLeft visualisation (non-boss has 2 max, boss 1)
  const maxAttempts = isBoss ? 1 : 2
  const hearts = Array.from({ length: maxAttempts }, (_, i) => i < attemptsLeft)

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden animate-fadeIn"
      style={{ background: world.lightBg }}
    >
      {/* Hero bar */}
      <HeroBar hero={hero} />

      {/* World bar */}
      <div
        className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{ background: world.darkBg, minHeight: 44 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{world.emoji}</span>
          <span className="font-fredoka" style={{ color: world.textLight, fontSize: 16 }}>
            {world.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-nunito text-sm font-semibold" style={{ color: world.textLight, opacity: 0.8 }}>
            {meta.icon} {meta.label}
          </span>
          <div className="flex gap-1 ml-2">
            {hearts.map((full, i) => (
              <span key={i} style={{ fontSize: 18, filter: full ? 'none' : 'grayscale(1)', opacity: full ? 1 : 0.3 }}>
                ❤️
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scene */}
      <div className="shrink-0" style={{ maxHeight: 130 }}>
        <Scene />
      </div>

      {/* Challenge card */}
      <div className="flex-1 overflow-hidden flex flex-col px-4 py-3 gap-3">
        {/* Boss banner */}
        {isBoss && (
          <div
            className="rounded-xl px-4 py-2 text-center font-fredoka text-lg animate-shimmer"
            style={{ background: '#3d0000', color: '#ff6060', border: '2px solid #ff6060' }}
          >
            ⚠️ BOSS CHALLENGE! ⚠️
          </div>
        )}

        {/* Narrative + question */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'white', border: `2px solid ${world.borderColor}` }}
        >
          <p className="font-nunito text-sm leading-relaxed mb-3" style={{ color: world.textDark, opacity: 0.75 }}>
            {data.narrative}
          </p>
          <p className="font-fredoka leading-snug" style={{ color: world.textDark, fontSize: 18 }}>
            {data.question}
          </p>
        </div>

        {/* Hint */}
        {hintShown && (
          <div
            className="rounded-xl px-4 py-2 flex gap-2 items-start"
            style={{ background: '#fffbe6', border: '1.5px solid #f2cc60' }}
          >
            <span>💡</span>
            <p className="font-nunito text-sm" style={{ color: '#7a5c00' }}>{data.hint}</p>
          </div>
        )}

        {/* Answer input */}
        {data.answerFormat === 'mcq' ? (
          <MCQInput
            options={data.options}
            onAnswer={onAnswer}
            world={world}
          />
        ) : (
          <NumberPad
            onAnswer={onAnswer}
            correctAnswer={data.correctAnswer}
            world={world}
          />
        )}

        {/* Hint button (only when attempts remain and answer not yet given) */}
        {!hintShown && attemptsLeft < maxAttempts && (
          <button
            onClick={onShowHint}
            className="font-nunito font-semibold text-sm rounded-xl self-center px-5 py-2"
            style={{
              background: 'transparent',
              color: world.accentColor,
              border: `1.5px solid ${world.borderColor}`,
              minHeight: 44,
              cursor: 'pointer',
            }}
          >
            💡 Show Hint
          </button>
        )}
      </div>
    </div>
  )
}
