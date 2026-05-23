import { renderHook, act } from '@testing-library/react'
import useGameState from '../hooks/useGameState'

// Correct answers matching MOCK_CHALLENGES order:
// [0] MCQ correctIndex=1, [1] number '61', [2] MCQ correctIndex=1, [3] boss MCQ correctIndex=2
const CORRECT_ANSWERS = [1, '61', 1, 2]

function setup() {
  const { result } = renderHook(() => useGameState())
  return result
}

function setupWithHero(result) {
  act(() => result.current.startGame())
  act(() => result.current.createHero({ name: 'Madhav', heroClass: 'warrior' }))
}

function playThroughWorld(result, worldId) {
  act(() => result.current.selectWorld(worldId))
  act(() => result.current.enterWorld())
  CORRECT_ANSWERS.forEach(answer => {
    act(() => result.current.submitAnswer(answer))
    act(() => result.current.continueFromResult())
  })
  // Last continueFromResult above triggered world-complete; now return to map
  act(() => result.current.returnToMap())
}

describe('Initial state', () => {
  it('phase is landing', () => {
    const result = setup()
    expect(result.current.phase).toBe('landing')
  })

  it('hero starts with empty name', () => {
    const result = setup()
    expect(result.current.hero.name).toBe('')
  })

  it('xp is 0', () => {
    const result = setup()
    expect(result.current.hero.xp).toBe(0)
  })

  it('all 5 worlds exist', () => {
    const result = setup()
    expect(result.current.worldStates).toHaveLength(5)
  })

  it('world[0] (Egypt) is unlocked', () => {
    const result = setup()
    expect(result.current.worldStates[0].unlocked).toBe(true)
    expect(result.current.worldStates[0].id).toBe('egypt')
  })

  it('worlds 1-4 are locked', () => {
    const result = setup()
    const locked = result.current.worldStates.slice(1)
    expect(locked.every(w => !w.unlocked)).toBe(true)
  })
})

describe('Hero creation', () => {
  it('createHero() transitions phase to world-map', () => {
    const result = setup()
    setupWithHero(result)
    expect(result.current.phase).toBe('world-map')
  })

  it('stores hero name correctly', () => {
    const result = setup()
    setupWithHero(result)
    expect(result.current.hero.name).toBe('Madhav')
  })

  it('stores hero class correctly', () => {
    const result = setup()
    setupWithHero(result)
    expect(result.current.hero.class).toBe('warrior')
  })

  it('hero starts at level 1 with 0 xp', () => {
    const result = setup()
    setupWithHero(result)
    expect(result.current.hero.level).toBe(1)
    expect(result.current.hero.xp).toBe(0)
  })
})

describe('XP and levelling', () => {
  it('correct first-attempt answer increases xp by 100', () => {
    const result = setup()
    setupWithHero(result)
    act(() => result.current.selectWorld('egypt'))
    act(() => result.current.enterWorld())
    act(() => result.current.submitAnswer(CORRECT_ANSWERS[0]))
    expect(result.current.hero.xp).toBe(100)
  })

  it('enough XP causes hero level to increase (300 XP → level 2)', () => {
    const result = setup()
    setupWithHero(result)
    act(() => result.current.selectWorld('egypt'))
    act(() => result.current.enterWorld())
    // 3 correct first-attempt answers = 300 XP → Explorer (level 2)
    act(() => result.current.submitAnswer(CORRECT_ANSWERS[0]))
    act(() => result.current.continueFromResult())
    act(() => result.current.submitAnswer(CORRECT_ANSWERS[1]))
    act(() => result.current.continueFromResult())
    act(() => result.current.submitAnswer(CORRECT_ANSWERS[2]))
    expect(result.current.hero.xp).toBe(300)
    expect(result.current.hero.level).toBe(2)
    expect(result.current.hero.title).toBe('Explorer')
  })

  it('wrong answers do not reduce XP', () => {
    const result = setup()
    setupWithHero(result)
    act(() => result.current.selectWorld('egypt'))
    act(() => result.current.enterWorld())
    act(() => result.current.submitAnswer(0)) // wrong — correctIndex is 1
    expect(result.current.hero.xp).toBe(0)
  })
})

describe('World progression', () => {
  it('completing world[0] marks worlds[0].completed as true', () => {
    const result = setup()
    setupWithHero(result)
    act(() => result.current.selectWorld('egypt'))
    act(() => result.current.enterWorld())
    CORRECT_ANSWERS.forEach(answer => {
      act(() => result.current.submitAnswer(answer))
      act(() => result.current.continueFromResult())
    })
    expect(result.current.worldStates[0].completed).toBe(true)
  })

  it('completing world[0] unlocks worlds[1]', () => {
    const result = setup()
    setupWithHero(result)
    act(() => result.current.selectWorld('egypt'))
    act(() => result.current.enterWorld())
    CORRECT_ANSWERS.forEach(answer => {
      act(() => result.current.submitAnswer(answer))
      act(() => result.current.continueFromResult())
    })
    expect(result.current.worldStates[1].unlocked).toBe(true)
  })

  it('completing all 5 worlds transitions phase to game-complete', () => {
    const result = setup()
    setupWithHero(result)
    const worldIds = ['egypt', 'medieval', 'space', 'safari', 'india']
    worldIds.forEach(worldId => playThroughWorld(result, worldId))
    expect(result.current.phase).toBe('game-complete')
  })
})
