import HeroBar from './HeroBar.jsx'

export default function ResultScreen({ hero, world, currentChallenge, onContinue, onTryAgain }) {
  const { data, isCorrect, xpEarned, attemptsLeft } = currentChallenge
  const isBoss = data.challengeType === 'boss'
  const canRetry = !isCorrect && attemptsLeft > 0

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
            background: isCorrect ? '#EAF3DE' : '#FCEBEB',
            border: `3px solid ${isCorrect ? '#3B6D11' : '#A32D2D'}`,
          }}
        >
          <span style={{ fontSize: 48 }}>{isCorrect ? (isBoss ? '🏆' : '🌟') : '💪'}</span>
          <p
            className="font-fredoka text-center"
            style={{ color: isCorrect ? '#3B6D11' : '#A32D2D', fontSize: 22 }}
          >
            {isCorrect
              ? data.reaction
              : canRetry
                ? "Not quite — have another try!"
                : "Good effort! Here's the answer:"}
          </p>
          {!isCorrect && (
            <p className="font-nunito font-bold text-center text-sm" style={{ color: '#A32D2D', opacity: 0.85 }}>
              Correct answer: <strong>{data.correctAnswer}</strong>
            </p>
          )}
        </div>

        {/* XP earned */}
        {xpEarned > 0 && (
          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-3 w-full"
            style={{ background: '#1e2440', border: '1.5px solid #f2cc6044' }}
          >
            <span style={{ fontSize: 24 }}>✨</span>
            <span className="font-fredoka text-xl" style={{ color: '#f2cc60' }}>+{xpEarned} XP</span>
            <span className="font-nunito text-sm ml-auto" style={{ color: '#8899bb' }}>
              {hero.totalXP} total
            </span>
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

        {/* Action buttons */}
        <div className="flex flex-col gap-3 w-full mt-auto">
          {canRetry && (
            <button
              onClick={onTryAgain}
              className="w-full font-fredoka rounded-2xl"
              style={{
                background: 'white',
                color: world.accentColor,
                fontSize: 18,
                padding: '14px',
                minHeight: 56,
                border: `2.5px solid ${world.borderColor}`,
                cursor: 'pointer',
              }}
            >
              🔄 Try Again
            </button>
          )}
          <button
            onClick={onContinue}
            className="w-full font-fredoka rounded-2xl"
            style={{
              background: '#534AB7',
              color: 'white',
              fontSize: 20,
              padding: '16px',
              minHeight: 60,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 20px #534AB755',
            }}
          >
            {isCorrect ? 'Continue →' : 'Move On →'}
          </button>
        </div>
      </div>
    </div>
  )
}
