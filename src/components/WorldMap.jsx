import worlds from '../worlds/index.js'

// Winding path node positions on a 380×520 canvas
const NODE_POSITIONS = [
  { x: 190, y: 460 }, // Egypt (start, bottom)
  { x: 80,  y: 350 }, // Medieval
  { x: 280, y: 240 }, // Space
  { x: 80,  y: 140 }, // Safari
  { x: 220, y: 50  }, // India (top)
]

function StarRating({ stars, size = 16 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(n => (
        <span key={n} style={{ fontSize: size, opacity: n <= stars ? 1 : 0.25 }}>⭐</span>
      ))}
    </div>
  )
}

export default function WorldMap({ worldStates, onSelectWorld }) {
  const canvasW = 380
  const canvasH = 520

  return (
    <div
      className="w-full h-full flex flex-col animate-fadeIn"
      style={{ background: '#0d0f1a' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-2 shrink-0">
        <h2 className="font-fredoka" style={{ color: '#f2cc60', fontSize: 26 }}>World Map</h2>
        <p className="font-nunito text-sm" style={{ color: '#8899bb' }}>Tap a world to begin your adventure!</p>
      </div>

      {/* Map canvas — fills remaining space */}
      <div className="flex-1 relative overflow-hidden">
        <svg
          viewBox={`0 0 ${canvasW} ${canvasH}`}
          style={{ width: '100%', height: '100%' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Path between nodes */}
          {NODE_POSITIONS.slice(0, -1).map((pos, i) => {
            const next = NODE_POSITIONS[i + 1]
            const ws = worldStates[i]
            const connected = ws?.completed || ws?.unlocked
            return (
              <line
                key={i}
                x1={pos.x} y1={pos.y}
                x2={next.x} y2={next.y}
                stroke={connected ? '#f2cc60' : '#2e3a60'}
                strokeWidth={connected ? 4 : 3}
                strokeDasharray={connected ? '0' : '10 8'}
                opacity={connected ? 0.6 : 0.4}
              />
            )
          })}

          {/* World nodes */}
          {worlds.map((world, i) => {
            const pos = NODE_POSITIONS[i]
            const ws = worldStates.find(w => w.id === world.id)
            const unlocked = ws?.unlocked ?? false
            const completed = ws?.completed ?? false
            const stars = ws?.starsEarned ?? 0

            return (
              <g
                key={world.id}
                onClick={() => unlocked && onSelectWorld(world.id)}
                style={{ cursor: unlocked ? 'pointer' : 'default' }}
              >
                {/* Glow ring for current/available */}
                {unlocked && !completed && (
                  <circle
                    cx={pos.x} cy={pos.y} r={38}
                    fill="none"
                    stroke={world.accentColor}
                    strokeWidth={3}
                    opacity={0.4}
                    style={{ animation: 'shimmer 1.8s ease-in-out infinite' }}
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={pos.x} cy={pos.y} r={32}
                  fill={completed ? world.darkBg : unlocked ? '#1e2440' : '#12172a'}
                  stroke={completed ? world.accentColor : unlocked ? world.borderColor : '#2e3a60'}
                  strokeWidth={completed ? 3 : 2}
                  opacity={unlocked ? 1 : 0.5}
                />

                {/* Emoji */}
                <text
                  x={pos.x} y={pos.y + 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={unlocked ? 28 : 22}
                  opacity={unlocked ? 1 : 0.4}
                >
                  {world.emoji}
                </text>

                {/* Completed tick */}
                {completed && (
                  <text
                    x={pos.x + 24} y={pos.y - 22}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={18}
                  >
                    ✅
                  </text>
                )}

                {/* Lock for locked worlds */}
                {!unlocked && (
                  <text
                    x={pos.x + 22} y={pos.y - 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={14}
                    opacity={0.6}
                  >
                    🔒
                  </text>
                )}

                {/* World name */}
                <text
                  x={pos.x}
                  y={pos.y + 42}
                  textAnchor="middle"
                  fontFamily="'Fredoka One', cursive"
                  fontSize={14}
                  fill={unlocked ? world.accentColor : '#4a5580'}
                  opacity={unlocked ? 1 : 0.6}
                >
                  {world.name}
                </text>

                {/* Stars (completed worlds) */}
                {completed && stars > 0 && (
                  <text x={pos.x} y={pos.y + 58} textAnchor="middle" fontSize={12}>
                    {'⭐'.repeat(stars)}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
