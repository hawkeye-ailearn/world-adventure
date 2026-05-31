import { useEffect, useState } from 'react'
import HeroBar from './HeroBar.jsx'

export default function WorldComplete({ hero, world, worldState, nextWorld, onReturnToMap }) {
  const { starsEarned, challengesCompleted, xpEarned } = worldState
  const [starsVisible, setStarsVisible] = useState(0)
  const isFinalWorld = !nextWorld

  useEffect(() => {
    let t = 0
    for (let i = 1; i <= starsEarned; i++) {
      t += 400
      setTimeout(() => setStarsVisible(i), t)
    }
  }, [starsEarned])

  const isAllThree = starsEarned === 3

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden animate-slideUp"
      style={{ background: world.lightBg }}
    >
      <HeroBar hero={hero} />

      {/* World bar */}
      <div
        className="flex items-center justify-center gap-3 px-4 py-3 shrink-0"
        style={{ background: world.darkBg }}
      >
        <span className="text-2xl">{world.emoji}</span>
        <h2 className="font-fredoka text-center" style={{ color: world.textLight, fontSize: 20 }}>
          {world.name} Complete!
        </h2>
        <span className="text-2xl">{world.emoji}</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-between px-6 py-5 overflow-hidden">
        {/* Trophy + title */}
        <div className="flex flex-col items-center gap-3">
          <span style={{ fontSize: 64 }}>{isFinalWorld ? '👑' : '🏆'}</span>
          <h3 className="font-fredoka text-center" style={{ color: world.textDark, fontSize: 26 }}>
            {isFinalWorld
              ? 'You completed World Quest!'
              : isAllThree ? "PERFECT!" : starsEarned === 2 ? "Great Job!" : "Well Done!"}
          </h3>
          <p className="font-nunito text-center text-sm" style={{ color: world.textDark, opacity: 0.7 }}>
            {challengesCompleted} challenges completed
            {xpEarned > 0 && (
              <span className="font-fredoka ml-2" style={{ color: world.accentColor }}>
                +{xpEarned} XP
              </span>
            )}
          </p>
        </div>

        {/* Stars */}
        <div className="flex gap-4 items-center justify-center">
          {[1, 2, 3].map(n => (
            <span
              key={n}
              style={{
                fontSize: 52,
                opacity: n <= starsVisible ? 1 : 0.2,
                transform: n <= starsVisible ? 'scale(1)' : 'scale(0.5)',
                transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                filter: n <= starsVisible ? 'drop-shadow(0 0 8px #f2cc60)' : 'none',
              }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Rating / next world message */}
        <div
          className="w-full rounded-2xl p-4 text-center"
          style={{ background: 'white', border: `2px solid ${world.borderColor}` }}
        >
          {isFinalWorld ? (
            <p className="font-fredoka" style={{ color: world.textDark, fontSize: 18 }}>
              You are a true {hero.title}! The world bows before your wisdom! 🌍
            </p>
          ) : (
            <>
              <p className="font-fredoka" style={{ color: world.textDark, fontSize: 18 }}>
                {isAllThree
                  ? "Amazing! You got almost everything right first try!"
                  : starsEarned === 2
                  ? "Great work! A few more tries next time!"
                  : "You finished! Keep practising to earn more stars!"}
              </p>
              <p className="font-nunito text-sm mt-2" style={{ color: world.accentColor, fontWeight: 700 }}>
                🔓 You unlocked {nextWorld.name}! {nextWorld.emoji}
              </p>
            </>
          )}
        </div>

        {/* Return button */}
        <button
          onClick={onReturnToMap}
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
          {isFinalWorld ? 'See your final score 👑' : 'Back to World Map 🗺️'}
        </button>
      </div>
    </div>
  )
}
