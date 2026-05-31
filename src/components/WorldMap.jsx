import worlds from '../worlds/index.js'

// Zone positions as % of the illustrated map image (left%, top%)
// Tuned to the watercolour treasure-map artwork (1448×1086, 4:3 landscape)
// in public/world-map.png. Coordinates are relative to the image itself,
// not the outer container — the image is rendered with contain so they stay accurate.
const ZONE_POSITIONS = [
  { left: '22%', top: '78%' }, // Egypt    — pyramids / Sphinx, bottom-left
  { left: '72%', top: '68%' }, // Medieval — castle, bottom-right
  { left: '17%', top: '38%' }, // Space    — nebula / rocket, left-middle
  { left: '77%', top: '26%' }, // Safari   — savanna / animals, top-right
  { left: '44%', top: '20%' }, // India    — temple / lotus, top-centre
]

// Image natural dimensions (1448×1086) → aspect ratio for the contain box
const IMG_W = 1448
const IMG_H = 1086

function Stars({ count }) {
  return (
    <div
      className="flex gap-0.5 justify-center mt-1"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }}
    >
      {[1, 2, 3].map(n => (
        <span key={n} style={{ fontSize: 14, opacity: n <= count ? 1 : 0.25 }}>⭐</span>
      ))}
    </div>
  )
}

export default function WorldMap({ worldStates, onSelectWorld }) {
  return (
    <div className="w-full h-full flex flex-col animate-fadeIn" style={{ background: '#0d0f1a' }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-2 shrink-0">
        <h2 className="font-fredoka" style={{ color: '#f2cc60', fontSize: 26 }}>World Map</h2>
        <p className="font-nunito text-sm" style={{ color: '#8899bb' }}>Tap a world to begin your adventure!</p>
      </div>

      {/* Outer frame — fills remaining space, clips letterbox bars */}
      <div
        className="flex-1 relative overflow-hidden mx-3 mb-3 rounded-xl"
        style={{ border: '2px solid #2a3158', background: '#0a0c18' }}
      >
        {/*
          Inner box locked to the image's 4:3 aspect ratio, centred in the frame.
          objectFit:contain on the <img> means the full artwork is always visible
          and the overlay percentages always map to the correct image regions.
        */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          aspectRatio: `${IMG_W} / ${IMG_H}`,
          maxHeight: '100%',
          maxWidth: `calc(100% * ${IMG_W} / ${IMG_H})`,
        }}>
          {/* Illustrated background */}
          <img
            src="/world-map.png"
            alt="World Map"
            draggable={false}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'fill',
              userSelect: 'none',
            }}
          />

          {/* Per-world zone overlays — percentages are relative to this box */}
          {worlds.map((world, i) => {
            const pos = ZONE_POSITIONS[i]
            if (!pos) return null

            const ws = worldStates.find(w => w.id === world.id)
            const unlocked  = ws?.unlocked  ?? false
            const completed = ws?.completed ?? false
            const stars     = ws?.starsEarned ?? 0
            const isActive  = unlocked && !completed

            return (
              <div
                key={world.id}
                role="button"
                tabIndex={unlocked ? 0 : -1}
                onClick={() => { if (unlocked) onSelectWorld(world.id) }}
                onKeyDown={(e) => { if (unlocked && (e.key === 'Enter' || e.key === ' ')) onSelectWorld(world.id) }}
                style={{
                  position: 'absolute',
                  left: pos.left,
                  top: pos.top,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Bob animation wrapper */}
                <div
                  className={isActive ? 'animate-bob' : ''}
                  style={{
                    position: 'relative',
                    width: 72,
                    height: 72,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {/* Emoji circle */}
                  <div
                    className={isActive ? 'animate-gold-pulse' : ''}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 30,
                      cursor: unlocked ? 'pointer' : 'default',
                      background: completed
                        ? `${world.darkBg}cc`
                        : unlocked
                          ? 'rgba(20,26,50,0.75)'
                          : 'rgba(10,12,24,0.55)',
                      border: completed || isActive
                        ? `3px solid ${world.accentColor}`
                        : '2px solid rgba(80,100,160,0.4)',
                      filter: !unlocked ? 'grayscale(1) brightness(0.55)' : 'none',
                      transform: !unlocked ? 'scale(0.88)' : 'scale(1)',
                      transition: 'transform 0.2s, filter 0.3s',
                      minWidth: 54,
                      minHeight: 54,
                    }}
                  >
                    {world.emoji}
                  </div>

                  {/* Lock icon overlay */}
                  {!unlocked && (
                    <div style={{
                      position: 'absolute',
                      bottom: 18,
                      right: -2,
                      fontSize: 18,
                      lineHeight: 1,
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))',
                    }}>
                      🔒
                    </div>
                  )}

                  {/* Stars below completed zone */}
                  {completed && stars > 0 && <Stars count={stars} />}

                  {/* World name label */}
                  <div
                    className="font-fredoka"
                    style={{
                      marginTop: completed && stars > 0 ? 2 : 4,
                      fontSize: 11,
                      color: unlocked ? world.accentColor : '#4a5580',
                      opacity: unlocked ? 1 : 0.6,
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                      lineHeight: 1.1,
                      maxWidth: 80,
                    }}
                  >
                    {world.name}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
