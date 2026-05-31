import PropTypes from 'prop-types'

export default function LevelUpBanner({ hero }) {
  if (!hero.levelledUp) return null
  return (
    <div
      className="w-full rounded-2xl px-4 py-3 flex items-center gap-3"
      style={{ background: '#2a1060', border: '2px solid #a855f7' }}
    >
      <span style={{ fontSize: 28 }}>🎉</span>
      <div>
        <p className="font-fredoka" style={{ color: '#e9d5ff', fontSize: 18 }}>
          Level Up!
        </p>
        <p className="font-nunito text-sm" style={{ color: '#c4b5fd' }}>
          You are now a <strong>{hero.title}</strong>!
        </p>
      </div>
    </div>
  )
}

LevelUpBanner.propTypes = {
  hero: PropTypes.shape({
    levelledUp: PropTypes.bool,
    title: PropTypes.string,
  }).isRequired,
}
