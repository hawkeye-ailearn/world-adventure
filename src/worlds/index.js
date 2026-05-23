import EgyptScene from '../scenes/EgyptScene.jsx'
import MedievalScene from '../scenes/MedievalScene.jsx'
import SpaceScene from '../scenes/SpaceScene.jsx'
import SafariScene from '../scenes/SafariScene.jsx'
import IndiaScene from '../scenes/IndiaScene.jsx'

const worlds = [
  {
    id: 'egypt',
    name: 'Ancient Egypt',
    emoji: '🏺',
    accentColor: '#BA7517',
    lightBg: '#FAEEDA',
    darkBg: '#7d3a00',
    textLight: '#FAEEDA',
    textDark: '#412402',
    borderColor: '#EF9F27',
    Scene: EgyptScene,
    loadingMessage: 'The Sphinx is thinking...',
    context:
      'Ancient Egypt, 2560 BC. Pharaohs rule the land, the pyramids are being built, and the Nile floods bring fertile soil. Topics: pyramids, pharaohs, hieroglyphics, mummification, the Nile, Egyptian gods.',
  },
  {
    id: 'medieval',
    name: 'Medieval Kingdom',
    emoji: '🏰',
    accentColor: '#4B6CB7',
    lightBg: '#E8EDF5',
    darkBg: '#1a2744',
    textLight: '#E8EDF5',
    textDark: '#0e1628',
    borderColor: '#6B8DD6',
    Scene: MedievalScene,
    loadingMessage: 'The wizard is consulting his scrolls...',
    context:
      'Medieval Europe, 1200 AD. Knights in armour, castle sieges, the Crusades, the Black Death, feudal system. Topics: knights, castles, kings and queens, jousting, the church, trade and guilds.',
  },
  {
    id: 'space',
    name: 'Outer Space',
    emoji: '🚀',
    accentColor: '#7B2FBE',
    lightBg: '#EDE3F5',
    darkBg: '#0a0020',
    textLight: '#EDE3F5',
    textDark: '#2d0060',
    borderColor: '#A855F7',
    Scene: SpaceScene,
    loadingMessage: 'Mission Control is calculating...',
    context:
      'The Solar System and beyond. Topics: planets, moons, stars, the Sun, astronauts, rockets, black holes, the Moon landings, the International Space Station, constellations.',
  },
  {
    id: 'safari',
    name: 'African Safari',
    emoji: '🦁',
    accentColor: '#8B6914',
    lightBg: '#FDF4E0',
    darkBg: '#4a3200',
    textLight: '#FDF4E0',
    textDark: '#2a1900',
    borderColor: '#D4A017',
    Scene: SafariScene,
    loadingMessage: 'The elder is preparing a riddle...',
    context:
      'The African savanna. Topics: African animals (lions, elephants, giraffes, zebras, cheetahs), ecosystems, food chains, migration, conservation, African geography and rivers.',
  },
  {
    id: 'india',
    name: 'Ancient India',
    emoji: '🪔',
    accentColor: '#C0392B',
    lightBg: '#FDEEE9',
    darkBg: '#5c1800',
    textLight: '#FDEEE9',
    textDark: '#380d00',
    borderColor: '#E74C3C',
    Scene: IndiaScene,
    loadingMessage: 'The ancient scroll is being unrolled...',
    context:
      'Ancient India, the age of great empires and discoveries. Topics: invention of zero, the decimal system, Ashoka, the Taj Mahal, Indian animals, yoga, spices, the Silk Road, Bollywood.',
  },
]

export default worlds
