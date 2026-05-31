import { useEffect, useState } from 'react'

const WORLD_EMOJIS = ['🏺', '🏰', '🚀', '🦁', '🪔']

// Deterministic star positions so it doesn't re-randomise on renders
const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: ((i * 137.5) % 100),
  y: ((i * 97.3) % 100),
  r: 0.8 + (i % 3) * 0.6,
  delay: (i % 8) * 0.3,
}))

export default function LandingScreen({ onStart }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setVisible(true) }, [])

  return (
    <div
      data-testid="landing-screen"
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0d0f1a' }}
    >
      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill="white"
            opacity={0.35}
            style={{ animation: `twinkle ${2 + (i % 4)}s ${s.delay}s ease-in-out infinite` }}
          />
        ))}
      </svg>

      {/* Content */}
      <div
        className="relative flex flex-col items-center gap-6 px-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
        }}
      >
        {/* Title */}
        <div className="flex flex-col items-center gap-1">
          <span
            className="font-fredoka text-center leading-tight"
            style={{ fontSize: 52, color: '#f2cc60', textShadow: '0 0 40px #f2cc6066' }}
          >
            WORLD
          </span>
          <span
            className="font-fredoka text-center leading-tight"
            style={{ fontSize: 52, color: '#f2cc60', textShadow: '0 0 40px #f2cc6066' }}
          >
            QUEST
          </span>
        </div>

        {/* Subtitle */}
        <p
          className="font-nunito text-center font-semibold"
          style={{ color: '#8899bb', fontSize: 16, maxWidth: 280 }}
        >
          An Adventure Through Time & Space
        </p>

        {/* World emoji row */}
        <div className="flex gap-4">
          {WORLD_EMOJIS.map((em, i) => (
            <span
              key={i}
              className="text-3xl"
              style={{
                animation: `bounce ${1.8 + i * 0.2}s ${i * 0.15}s ease-in-out infinite`,
              }}
            >
              {em}
            </span>
          ))}
        </div>

        {/* Begin button */}
        <button
          data-testid="begin-adventure-btn"
          onClick={onStart}
          className="font-fredoka rounded-2xl w-full"
          style={{
            background: '#534AB7',
            color: 'white',
            fontSize: 22,
            padding: '16px 48px',
            minHeight: 60,
            minWidth: 240,
            border: 'none',
            boxShadow: '0 4px 20px #534AB766',
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
        >
          Begin Adventure ✨
        </button>

        {/* Tagline */}
        <p className="font-nunito text-center text-sm" style={{ color: '#4a5580' }}>
          5 worlds · history · maths · science
        </p>
      </div>
    </div>
  )
}
