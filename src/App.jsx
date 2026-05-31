import useGameState from './hooks/useGameState.js'
import LandingScreen from './components/LandingScreen.jsx'
import HeroCreator from './components/HeroCreator.jsx'
import WorldMap from './components/WorldMap.jsx'
import WorldEntry from './components/WorldEntry.jsx'
import ChallengeScreen from './components/ChallengeScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import WorldComplete from './components/WorldComplete.jsx'
import GameComplete from './components/GameComplete.jsx'

export default function App() {
  const game = useGameState()

  const {
    phase,
    hero,
    worldStates,
    currentChallenge,
    startGame,
    createHero,
    selectWorld,
    enterWorld,
    submitAnswer,
    continueFromResult,
    returnToMap,
    getActiveWorld,
    getWorldState,
    getNextWorld,
  } = game

  const activeWorld = getActiveWorld()

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        maxWidth: 430,
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {phase === 'landing' && (
        <LandingScreen onStart={startGame} />
      )}

      {phase === 'hero-creator' && (
        <HeroCreator onCreateHero={createHero} />
      )}

      {phase === 'world-map' && (
        <WorldMap
          worldStates={worldStates}
          onSelectWorld={selectWorld}
        />
      )}

      {phase === 'world-entry' && activeWorld && (
        <WorldEntry
          world={activeWorld}
          onEnter={enterWorld}
        />
      )}

      {phase === 'challenge' && currentChallenge && activeWorld && (
        <ChallengeScreen
          hero={hero}
          world={activeWorld}
          currentChallenge={currentChallenge}
          onAnswer={submitAnswer}
        />
      )}

      {phase === 'result' && currentChallenge && activeWorld && (
        <ResultScreen
          hero={hero}
          world={activeWorld}
          currentChallenge={currentChallenge}
          onContinue={continueFromResult}
        />
      )}

      {phase === 'world-complete' && activeWorld && (
        <WorldComplete
          hero={hero}
          world={activeWorld}
          worldState={getWorldState(activeWorld.id)}
          nextWorld={getNextWorld()}
          onReturnToMap={returnToMap}
        />
      )}

      {phase === 'game-complete' && (
        <GameComplete hero={hero} />
      )}
    </div>
  )
}
