import { useEffect, useRef, useState } from 'react'

const CLASS_EMOJI = { warrior: '⚔️', wizard: '🧙', explorer: '🗺️' }

const XP_MAX = { 1: 300, 2: 700, 3: 1200, 4: 9999 }

export default function HeroBar({ hero }) {
  const { name, class: heroClass, level, title, totalXP } = hero
  const max = XP_MAX[level] ?? 300
  const prev = level > 1 ? XP_MAX[level - 1] : 0
  const pct = Math.min(100, Math.round(((totalXP - prev) / (max - prev)) * 100))

  // Count-up animation for XP number
  const [displayXP, setDisplayXP] = useState(totalXP)
  const prevXPRef = useRef(totalXP)

  useEffect(() => {
    const start = prevXPRef.current
    const end = totalXP
    if (start === end) return

    const duration = 800
    const startTime = performance.now()
    let rafId

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayXP(Math.round(start + (end - start) * eased))
      if (progress < 1) rafId = requestAnimationFrame(tick)
      else prevXPRef.current = end
    }

    rafId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafId)
      prevXPRef.current = end
    }
  }, [totalXP])

  return (
    <div
      className="flex items-center gap-3 px-4 py-2 shrink-0"
      style={{ background: '#0d0f1a', minHeight: 54 }}
    >
      {/* Class emoji */}
      <span className="text-2xl leading-none">{CLASS_EMOJI[heroClass] ?? '🦸'}</span>

      {/* Name + title */}
      <div className="flex flex-col min-w-0">
        <span
          className="font-fredoka leading-tight truncate"
          style={{ color: '#f2cc60', fontSize: 17 }}
        >
          {name || 'Hero'}
        </span>
        <span className="font-nunito text-xs leading-tight" style={{ color: '#8899bb' }}>
          Lv {level} · {title}
        </span>
      </div>

      {/* XP bar */}
      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <div className="flex justify-between items-baseline">
          <span className="font-nunito text-xs" style={{ color: '#8899bb' }}>XP</span>
          <span className="font-fredoka text-xs" style={{ color: '#f2cc60' }}>{displayXP}</span>
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: 8, background: '#1e2440' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #f2cc60, #e8a030)',
              transition: 'width 0.6s ease-out',
            }}
          />
        </div>
      </div>
    </div>
  )
}
