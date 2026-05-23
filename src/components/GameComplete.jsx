const CLASS_FULL_TITLE = {
  warrior: 'Warrior',
  wizard: 'Wizard',
  explorer: 'Explorer',
}

const CONFETTI_ITEMS = ['⭐', '🌟', '✨', '🎉', '🏆', '🎊', '💫', '🌈']

const CONFETTI_POS = Array.from({ length: 20 }, (_, i) => ({
  left: (i * 17.3) % 100,
  top: (i * 23.7) % 80,
  item: CONFETTI_ITEMS[i % CONFETTI_ITEMS.length],
  delay: (i * 0.18) % 2,
  size: 18 + (i % 3) * 8,
}))

export default function GameComplete({ hero }) {
  const classTitle = CLASS_FULL_TITLE[hero.class] ?? hero.class
  const finalTitle = `${hero.title} ${classTitle}`

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#0d0f1a' }}
    >
      {/* Confetti */}
      {CONFETTI_POS.map((c, i) => (
        <span
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${c.left}%`,
            top: `${c.top}%`,
            fontSize: c.size,
            animation: `bounce ${1.5 + c.delay}s ${c.delay}s ease-in-out infinite`,
            opacity: 0.7,
          }}
        >
          {c.item}
        </span>
      ))}

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-5 px-8 text-center animate-popIn">
        <span style={{ fontSize: 80 }}>🏆</span>

        <div>
          <h1 className="font-fredoka" style={{ color: '#f2cc60', fontSize: 36, lineHeight: 1.1 }}>
            Quest Complete!
          </h1>
          <p className="font-nunito font-semibold mt-2" style={{ color: '#8899bb', fontSize: 16 }}>
            You conquered all 5 worlds!
          </p>
        </div>

        {/* Hero title card */}
        <div
          className="rounded-3xl px-8 py-5 flex flex-col items-center gap-2 w-full"
          style={{ background: '#1e2440', border: '2.5px solid #f2cc60' }}
        >
          <p className="font-nunito text-sm" style={{ color: '#8899bb' }}>Your hero title:</p>
          <p
            className="font-fredoka"
            style={{ color: '#f2cc60', fontSize: 28, textShadow: '0 0 20px #f2cc6055' }}
          >
            {hero.name}
          </p>
          <p className="font-fredoka" style={{ color: 'white', fontSize: 20 }}>
            The {finalTitle}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-nunito text-sm" style={{ color: '#8899bb' }}>Total XP:</span>
            <span className="font-fredoka text-xl" style={{ color: '#f2cc60' }}>{hero.totalXP}</span>
          </div>
        </div>

        {/* Worlds conquered */}
        <div className="flex gap-3">
          {['🏺', '🏰', '🚀', '🦁', '🪔'].map((em, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1"
              style={{ animation: `bounce ${1.8 + i * 0.15}s ${i * 0.1}s ease-in-out infinite` }}
            >
              <span style={{ fontSize: 28 }}>{em}</span>
              <span style={{ fontSize: 10 }}>⭐⭐⭐</span>
            </div>
          ))}
        </div>

        <p className="font-nunito font-semibold text-sm" style={{ color: '#534AB7' }}>
          Close the game or refresh to play again ✨
        </p>
      </div>
    </div>
  )
}
