import { useState } from 'react'

const CLASSES = [
  {
    id: 'warrior',
    emoji: '⚔️',
    name: 'Warrior',
    desc: 'Brave and bold! Battles every challenge head-on.',
    color: '#c0392b',
    border: '#e74c3c',
    bg: '#2a0a08',
  },
  {
    id: 'wizard',
    emoji: '🧙',
    name: 'Wizard',
    desc: 'Wise and magical! Uses clever thinking to solve puzzles.',
    color: '#7b2fbe',
    border: '#a855f7',
    bg: '#150828',
  },
  {
    id: 'explorer',
    emoji: '🗺️',
    name: 'Explorer',
    desc: 'Curious and adventurous! Discovers secrets in every world.',
    color: '#1a6b4a',
    border: '#27ae60',
    bg: '#081a12',
  },
]

export default function HeroCreator({ onCreateHero }) {
  const [name, setName] = useState('')
  const [selectedClass, setSelectedClass] = useState(null)

  const canStart = name.trim().length >= 1 && selectedClass !== null

  function handleStart() {
    if (!canStart) return
    onCreateHero({ name: name.trim(), heroClass: selectedClass })
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-6 px-6 overflow-hidden animate-fadeIn"
      style={{ background: '#0d0f1a' }}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-1">
        <h1 className="font-fredoka text-center" style={{ color: '#f2cc60', fontSize: 32 }}>
          Create Your Hero
        </h1>
        <p className="font-nunito text-center text-sm" style={{ color: '#8899bb' }}>
          Choose your name and class to begin
        </p>
      </div>

      {/* Name input */}
      <div className="w-full max-w-sm">
        <label className="font-nunito font-semibold text-sm block mb-2" style={{ color: '#8899bb' }}>
          Your hero's name
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name..."
          maxLength={20}
          className="w-full rounded-xl font-fredoka text-center"
          style={{
            background: '#1e2440',
            border: '2px solid #2e3a60',
            color: '#f2cc60',
            fontSize: 22,
            padding: '14px 16px',
            minHeight: 56,
            outline: 'none',
          }}
          onFocus={e => (e.target.style.borderColor = '#534AB7')}
          onBlur={e => (e.target.style.borderColor = '#2e3a60')}
        />
      </div>

      {/* Class picker */}
      <div className="w-full max-w-sm">
        <p className="font-nunito font-semibold text-sm mb-2" style={{ color: '#8899bb' }}>
          Pick your class
        </p>
        <div className="flex flex-col gap-3">
          {CLASSES.map(cls => {
            const isSelected = selectedClass === cls.id
            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className="flex items-center gap-4 rounded-2xl text-left w-full"
                style={{
                  background: isSelected ? cls.bg : '#12172a',
                  border: `2px solid ${isSelected ? cls.border : '#2e3a60'}`,
                  padding: '14px 16px',
                  minHeight: 60,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, background 0.15s',
                  boxShadow: isSelected ? `0 0 12px ${cls.color}44` : 'none',
                }}
              >
                <span className="text-3xl leading-none">{cls.emoji}</span>
                <div className="flex flex-col">
                  <span
                    className="font-fredoka"
                    style={{ color: isSelected ? cls.border : '#ccd0e0', fontSize: 18 }}
                  >
                    {cls.name}
                  </span>
                  <span className="font-nunito text-sm" style={{ color: '#6678aa' }}>
                    {cls.desc}
                  </span>
                </div>
                {isSelected && (
                  <span className="ml-auto text-lg" style={{ color: cls.border }}>✓</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={!canStart}
        className="font-fredoka rounded-2xl w-full max-w-sm"
        style={{
          background: canStart ? '#534AB7' : '#2e3a60',
          color: canStart ? 'white' : '#6678aa',
          fontSize: 20,
          padding: '16px',
          minHeight: 60,
          border: 'none',
          cursor: canStart ? 'pointer' : 'default',
          transition: 'background 0.2s',
          boxShadow: canStart ? '0 4px 20px #534AB766' : 'none',
        }}
      >
        {canStart ? `Let's Go, ${name.trim()}! 🚀` : 'Pick a name and class ↑'}
      </button>
    </div>
  )
}
