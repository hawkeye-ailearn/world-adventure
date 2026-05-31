export default function MCQInput({ options, onAnswer, disabled, selectedIndex, correctIndex, wrongIndex, world }) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {options.map((option, i) => {
        const isSelected = selectedIndex === i
        const isRevealed = correctIndex !== null && disabled
        const isCorrect = isRevealed && i === correctIndex
        const isWrong = (isSelected && isRevealed && i !== correctIndex) || (wrongIndex !== undefined && wrongIndex !== null && i === wrongIndex)

        let bg = world.lightBg
        let border = world.borderColor
        let textColor = world.textDark

        if (isCorrect) {
          bg = '#EAF3DE'
          border = '#3B6D11'
          textColor = '#3B6D11'
        } else if (isWrong) {
          bg = '#FCEBEB'
          border = '#A32D2D'
          textColor = '#A32D2D'
        } else if (isSelected) {
          border = world.accentColor
        }

        const isDisabled = disabled || (wrongIndex !== undefined && wrongIndex !== null && i === wrongIndex)

        return (
          <button
            key={i}
            data-testid={`mcq-option-${i}`}
            onClick={() => !isDisabled && onAnswer(i)}
            disabled={isDisabled}
            className="rounded-2xl font-nunito font-bold text-left flex items-center gap-2"
            style={{
              background: bg,
              border: `2.5px solid ${border}`,
              color: textColor,
              fontSize: 15,
              padding: '14px 14px',
              minHeight: 64,
              cursor: isDisabled ? 'default' : 'pointer',
              transition: 'background 0.15s, border-color 0.15s',
              wordBreak: 'break-word',
            }}
          >
            <span
              className="font-fredoka shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm"
              style={{
                background: isCorrect ? '#3B6D11' : isWrong ? '#A32D2D' : world.darkBg,
                color: isCorrect ? 'white' : isWrong ? 'white' : world.textLight,
              }}
            >
              {isCorrect ? '✓' : isWrong ? '✗' : String.fromCharCode(65 + i)}
            </span>
            {option}
          </button>
        )
      })}
    </div>
  )
}
