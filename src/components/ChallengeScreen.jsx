import PropTypes from 'prop-types'
import HeroBar from './HeroBar.jsx'
import MCQInput from './MCQInput.jsx'
import NumberPad from './NumberPad.jsx'

const CHALLENGE_LABELS = {
  1: { label: 'History',          icon: '📜' },
  2: { label: 'Maths',            icon: '🔢' },
  3: { label: 'General',          icon: '🌍' },
  4: { label: 'Science',          icon: '🔬' },
  5: { label: 'Mixed',            icon: '⚡' },
  6: { label: 'BOSS',             icon: '👾' },
}

export default function ChallengeScreen({ hero, world, currentChallenge, onAnswer }) {
  const { data, challengeNumber, roundNumber, roundName, totalChallengesInRound, attemptsLeft, hintShown, selectedAnswer, isCorrect } = currentChallenge
  const { Scene } = world
  const isBoss = data.challengeType === 'boss'
  const meta = CHALLENGE_LABELS[challengeNumber] ?? { label: 'Challenge', icon: '❓' }

  const maxAttempts = isBoss ? 1 : 2
  const hearts = Array.from({ length: maxAttempts }, (_, i) => i < attemptsLeft)

  // Which option index was the wrong first answer (so it stays red on 2nd attempt)
  const wrongIndex =
    isCorrect === false && selectedAnswer !== null && data.answerFormat === 'mcq'
      ? parseInt(selectedAnswer)
      : null

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden animate-fadeIn"
      style={{ background: world.lightBg }}
    >
      {/* Hero bar */}
      <HeroBar
        hero={hero}
        challengeContext={{
          roundNumber,
          roundName,
          challengeNumber,
          totalChallengesInRound,
        }}
      />

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
              <span key={`heart-${i + 1}`} style={{ fontSize: 18, filter: full ? 'none' : 'grayscale(1)', opacity: full ? 1 : 0.3 }}>
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

        {/* Hint — slides in after wrong answer */}
        <div
          style={{
            overflow: 'hidden',
            maxHeight: hintShown ? 120 : 0,
            transition: 'max-height 0.35s ease-out',
          }}
        >
          <div
            className="rounded-xl px-4 py-3 flex gap-2 items-start"
            style={{ background: '#fffbe6', border: '1.5px solid #f2cc60' }}
          >
            <span>💡</span>
            <p className="font-nunito text-sm" style={{ color: '#7a5c00' }}>{data.hint}</p>
          </div>
        </div>

        {/* Answer input */}
        {data.answerFormat === 'mcq' ? (
          <MCQInput
            options={data.options}
            onAnswer={onAnswer}
            world={world}
            wrongIndex={wrongIndex}
          />
        ) : (
          <NumberPad
            key={attemptsLeft}
            onAnswer={onAnswer}
            correctAnswer={data.correctAnswer}
            world={world}
          />
        )}
      </div>
    </div>
  )
}

ChallengeScreen.propTypes = {
  hero: PropTypes.shape({
    name: PropTypes.string,
    class: PropTypes.string,
    level: PropTypes.number,
    title: PropTypes.string,
    totalXP: PropTypes.number,
  }).isRequired,
  world: PropTypes.shape({
    lightBg: PropTypes.string.isRequired,
    darkBg: PropTypes.string.isRequired,
    emoji: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    textLight: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
    textDark: PropTypes.string.isRequired,
    Scene: PropTypes.elementType.isRequired,
  }).isRequired,
  currentChallenge: PropTypes.shape({
    data: PropTypes.shape({
      challengeType: PropTypes.string,
      answerFormat: PropTypes.string,
      narrative: PropTypes.string,
      question: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string),
      hint: PropTypes.string,
      correctAnswer: PropTypes.string,
    }).isRequired,
    challengeNumber: PropTypes.number.isRequired,
    roundNumber: PropTypes.number,
    roundName: PropTypes.string,
    totalChallengesInRound: PropTypes.number,
    attemptsLeft: PropTypes.number.isRequired,
    hintShown: PropTypes.bool,
    selectedAnswer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isCorrect: PropTypes.bool,
  }).isRequired,
  onAnswer: PropTypes.func.isRequired,
}
