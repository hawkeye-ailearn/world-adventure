import { useState } from 'react'

const PAD_ROWS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['⌫', '0', '✓'],
]

export default function NumberPad({ onAnswer, correctAnswer, world }) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)

  function handleKey(key) {
    if (submitted) return
    if (key === '⌫') {
      setValue(v => v.slice(0, -1))
    } else if (key === '✓') {
      if (value === '') return
      const correct = value.trim() === String(correctAnswer).trim()
      setIsCorrect(correct)
      setSubmitted(true)
      onAnswer(value)
    } else {
      if (value.length >= 5) return
      setValue(v => v + key)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Display */}
      <div
        className="w-full rounded-2xl flex items-center justify-center font-fredoka"
        style={{
          background: submitted
            ? isCorrect ? '#EAF3DE' : '#FCEBEB'
            : world.lightBg,
          border: `2.5px solid ${
            submitted
              ? isCorrect ? '#3B6D11' : '#A32D2D'
              : world.borderColor
          }`,
          minHeight: 64,
          fontSize: 32,
          color: submitted
            ? isCorrect ? '#3B6D11' : '#A32D2D'
            : value ? world.textDark : '#aab0c8',
          transition: 'background 0.15s, border-color 0.15s',
          letterSpacing: '0.05em',
        }}
      >
        {value || '...'}
      </div>

      {/* Number pad grid */}
      <div className="grid gap-2 w-full" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {PAD_ROWS.flat().map((key, i) => {
          const isSubmit = key === '✓'
          const isBack = key === '⌫'
          return (
            <button
              key={i}
              onClick={() => handleKey(key)}
              disabled={submitted}
              className="rounded-xl font-fredoka flex items-center justify-center"
              style={{
                background: isSubmit
                  ? (value ? '#534AB7' : '#2e3a60')
                  : isBack
                  ? '#2e3a60'
                  : world.darkBg,
                color: isSubmit
                  ? (value ? 'white' : '#6678aa')
                  : world.textLight,
                fontSize: isSubmit || isBack ? 22 : 26,
                minHeight: 60,
                minWidth: 60,
                border: `1.5px solid ${isSubmit ? (value ? '#7b6cd0' : '#2e3a60') : world.borderColor}`,
                cursor: submitted ? 'default' : 'pointer',
                opacity: submitted ? 0.6 : 1,
                boxShadow: isSubmit && value ? '0 2px 10px #534AB755' : 'none',
                transition: 'background 0.1s',
              }}
            >
              {key}
            </button>
          )
        })}
      </div>
    </div>
  )
}
