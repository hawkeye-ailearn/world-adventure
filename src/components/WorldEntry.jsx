import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useChallenge from '../hooks/useChallenge.js'

export default function WorldEntry({ world, hero, roundNumber, onEnter }) {
  const { fetchChallenge, clearChallenge, isLoading, error } = useChallenge()
  const [challengeData, setChallengeData] = useState(null)

  function loadChallenge() {
    setChallengeData(null)
    fetchChallenge({ hero, worldId: world.id, roundNumber: roundNumber ?? 1, challengeNumber: 1 })
      .then(data => setChallengeData(data))
      .catch(() => {})
  }

  useEffect(() => {
    clearChallenge()
    loadChallenge()
  }, [world.id, roundNumber, clearChallenge, fetchChallenge]) // eslint-disable-line react-hooks/exhaustive-deps

  const { Scene } = world

  const ENTRY_NARRATIVE = {
    egypt:
      "The golden sands of Ancient Egypt stretch before you! You can see the mighty pyramids rising from the desert, and the Nile rushes nearby. The year is 2560 BC — pharaohs rule the land, and adventure awaits brave heroes like you!",
    medieval:
      "Stone battlements tower over the misty forest. Knights clank past in shining armour, and the smell of a feast drifts from the great hall. Welcome to the Medieval Kingdom — an age of heroes, quests, and daring deeds!",
    space:
      "Stars stretch in every direction as your rocket breaks free of Earth's atmosphere! Planets glow in the darkness below. The universe is vast, mysterious, and absolutely full of incredible things to discover!",
    safari:
      "The African savanna glows golden in the setting sun. A lion roars in the distance, and a herd of elephants marches slowly across the horizon. The great circle of life is happening all around you!",
    india:
      "Temple bells ring across a shimmering lotus pond. The scent of spices and jasmine fills the air. Ancient India is a land of mathematicians, elephants, and stories that will echo through time forever!",
  }

  const narrative = ENTRY_NARRATIVE[world.id] ?? "An exciting world awaits you! Are you ready?"

  return (
    <div
      className="w-full h-full flex flex-col animate-slideUp"
      style={{ background: world.lightBg }}
    >
      {/* World bar */}
      <div
        className="flex items-center gap-3 px-5 py-3 shrink-0"
        style={{ background: world.darkBg, minHeight: 54 }}
      >
        <span className="text-3xl">{world.emoji}</span>
        <h2 className="font-fredoka" style={{ color: world.textLight, fontSize: 22 }}>
          {world.name}
        </h2>
      </div>

      {/* Scene artwork */}
      <div className="shrink-0" style={{ maxHeight: 180 }}>
        <Scene />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between px-6 py-5 overflow-hidden">
        {/* Narrative text */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'white', border: `2px solid ${world.borderColor}`, opacity: 0.95 }}
        >
          <p className="font-nunito font-semibold leading-relaxed" style={{ color: world.textDark, fontSize: 16 }}>
            {narrative}
          </p>
        </div>

        {/* Challenge preview */}
        <div className="flex justify-center gap-3 py-3">
          {[{ icon: '📜', id: 'history' }, { icon: '🔢', id: 'maths' }, { icon: '🌍', id: 'general' }, { icon: '🔬', id: 'science' }, { icon: '⚡', id: 'mixed' }].map(({ icon, id }, i) => (
            <div key={id} className="flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ background: world.darkBg, border: `2px solid ${world.borderColor}` }}
              >
                {icon}
              </div>
              <span className="font-nunito text-xs font-semibold" style={{ color: world.textDark, opacity: 0.6 }}>
                Q{i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Enter button / loading / error */}
        {error ? (
          <button
            onClick={loadChallenge}
            className="w-full font-fredoka rounded-2xl"
            style={{
              background: '#A32D2D',
              color: 'white',
              fontSize: 18,
              padding: '16px',
              minHeight: 60,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Something went wrong — tap to retry
          </button>
        ) : (
          <button
            onClick={() => challengeData && onEnter(challengeData)}
            disabled={isLoading || !challengeData}
            className="w-full font-fredoka rounded-2xl"
            style={{
              background: isLoading || !challengeData ? '#8880cc' : '#534AB7',
              color: 'white',
              fontSize: 20,
              padding: '16px',
              minHeight: 60,
              border: 'none',
              cursor: isLoading || !challengeData ? 'not-allowed' : 'pointer',
              boxShadow: isLoading || !challengeData ? 'none' : '0 4px 20px #534AB755',
              opacity: isLoading || !challengeData ? 0.75 : 1,
            }}
          >
            {isLoading ? world.loadingMessage : `Enter ${world.name}! ${world.emoji}`}
          </button>
        )}
      </div>
    </div>
  )
}

WorldEntry.propTypes = {
  world: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    emoji: PropTypes.string.isRequired,
    lightBg: PropTypes.string.isRequired,
    darkBg: PropTypes.string.isRequired,
    textLight: PropTypes.string.isRequired,
    textDark: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
    loadingMessage: PropTypes.string,
    Scene: PropTypes.elementType.isRequired,
  }).isRequired,
  hero: PropTypes.shape({
    name: PropTypes.string,
    class: PropTypes.string,
  }).isRequired,
  roundNumber: PropTypes.number,
  onEnter: PropTypes.func.isRequired,
}
