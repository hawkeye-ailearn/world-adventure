import PropTypes from 'prop-types'

export default function WorldBar({ world }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2 shrink-0"
      style={{ background: world.darkBg, minHeight: 44 }}
    >
      <span className="text-xl">{world.emoji}</span>
      <span className="font-fredoka" style={{ color: world.textLight, fontSize: 16 }}>
        {world.name}
      </span>
    </div>
  )
}

WorldBar.propTypes = {
  world: PropTypes.shape({
    darkBg: PropTypes.string.isRequired,
    emoji: PropTypes.string.isRequired,
    textLight: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
}
