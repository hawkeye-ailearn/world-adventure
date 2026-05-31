import { renderHook, act } from '@testing-library/react'
import useGameState from '../hooks/useGameState'

// Test fixtures — one per challenge type
const TC = {
  history: {
    narrative: 'History challenge', challengeType: 'history',
    question: 'Who built the Great Pyramid?', answerFormat: 'mcq',
    options: ['Ramesses II', 'Khufu', 'Tutankhamun', 'Cleopatra'],
    correctIndex: 1, correctAnswer: 'Khufu',
    hint: 'Hint', reaction: 'Great!', funFact: 'Fun fact', xp: 100,
  },
  math: {
    narrative: 'Maths challenge', challengeType: 'math',
    question: 'How much is 24 + 37?', answerFormat: 'number',
    options: [], correctIndex: null, correctAnswer: '61',
    hint: 'Hint', reaction: 'Brilliant!', funFact: 'Fun fact', xp: 100,
  },
  general: {
    narrative: 'General knowledge', challengeType: 'general',
    question: 'What did the Nile give Egypt?', answerFormat: 'mcq',
    options: ['Snow', 'Fertile soil', 'Gold', 'Breezes'],
    correctIndex: 1, correctAnswer: 'Fertile soil',
    hint: 'Hint', reaction: 'Excellent!', funFact: 'Fun fact', xp: 100,
  },
  science: {
    narrative: 'Science challenge', challengeType: 'science',
    question: 'How hot is the Sahara?', answerFormat: 'mcq',
    options: ['30°C', '50°C', '70°C', '10°C'],
    correctIndex: 1, correctAnswer: '50°C',
    hint: 'Hint', reaction: 'Wow!', funFact: 'Fun fact', xp: 100,
  },
  mixed: {
    narrative: 'Mixed challenge', challengeType: 'mixed',
    question: 'How many seasons does Egypt have?', answerFormat: 'mcq',
    options: ['1', '2', '3', '4'],
    correctIndex: 1, correctAnswer: '2',
    hint: 'Hint', reaction: 'Amazing!', funFact: 'Fun fact', xp: 100,
  },
  boss: {
    narrative: 'Boss challenge', challengeType: 'boss',
    question: 'How many faces does a pyramid have?', answerFormat: 'mcq',
    options: ['3', '4', '5', '6'],
    correctIndex: 2, correctAnswer: '5',
    hint: 'Hint', reaction: 'Legendary!', funFact: 'Fun fact', xp: 200,
  },
}

// Sequence for 3 rounds: R1 (5), R2 (5), R3 (6 incl boss)
const ROUND1 = [TC.history, TC.math, TC.general, TC.science, TC.mixed]
const ROUND2 = [TC.history, TC.math, TC.general, TC.science, TC.mixed]
const ROUND3 = [TC.history, TC.math, TC.general, TC.science, TC.mixed, TC.boss]

// Correct answers indexed to match each challenge
function correctAnswer(tc) {
  return tc.answerFormat === 'mcq' ? tc.correctIndex : tc.correctAnswer
}

function setup() {
  const { result } = renderHook(() => useGameState())
  return result
}

function setupWithHero(result) {
  act(() => result.current.startGame())
  act(() => result.current.createHero({ name: 'Madhav', heroClass: 'warrior' }))
}

// Play through all 5 challenges of a round, then call continueFromResult(null) at the end
function playRound(result, challenges) {
  challenges.forEach((challenge, i) => {
    act(() => result.current.submitAnswer(correctAnswer(challenge)))
    const isLast = i === challenges.length - 1
    act(() => result.current.continueFromResult(isLast ? null : challenges[i + 1]))
  })
}

// Play a full world (3 rounds) — caller must have already called selectWorld + enterWorld(ROUND1[0])
function playWorldRounds(result) {
  // Round 1
  playRound(result, ROUND1)
  // phase is now 'round-complete'; advance to round 2
  act(() => result.current.startNextRound())
  act(() => result.current.enterWorld(ROUND2[0]))
  // Round 2
  playRound(result, ROUND2)
  // phase is now 'round-complete'; advance to round 3
  act(() => result.current.startNextRound())
  act(() => result.current.enterWorld(ROUND3[0]))
  // Round 3 (6 challenges)
  playRound(result, ROUND3)
  // phase is now 'world-complete'
}

function playThroughWorld(result, worldId) {
  act(() => result.current.selectWorld(worldId))
  act(() => result.current.enterWorld(ROUND1[0]))
  playWorldRounds(result)
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

  it('each world has 3 rounds', () => {
    const result = setup()
    result.current.worldStates.forEach(ws => {
      expect(ws.rounds).toHaveLength(3)
    })
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
    act(() => result.current.enterWorld(TC.history))
    act(() => result.current.submitAnswer(correctAnswer(TC.history)))
    expect(result.current.hero.xp).toBe(100)
  })

  it('enough XP causes hero level to increase (300 XP → level 2)', () => {
    const result = setup()
    setupWithHero(result)
    act(() => result.current.selectWorld('egypt'))
    act(() => result.current.enterWorld(TC.history))
    // 3 correct first-attempt answers = 300 XP → Explorer (level 2)
    act(() => result.current.submitAnswer(correctAnswer(TC.history)))
    act(() => result.current.continueFromResult(TC.math))
    act(() => result.current.submitAnswer(correctAnswer(TC.math)))
    act(() => result.current.continueFromResult(TC.general))
    act(() => result.current.submitAnswer(correctAnswer(TC.general)))
    expect(result.current.hero.xp).toBe(300)
    expect(result.current.hero.level).toBe(2)
    expect(result.current.hero.title).toBe('Explorer')
  })

  it('wrong answers do not reduce XP', () => {
    const result = setup()
    setupWithHero(result)
    act(() => result.current.selectWorld('egypt'))
    act(() => result.current.enterWorld(TC.history))
    act(() => result.current.submitAnswer(0)) // wrong — correctIndex is 1
    expect(result.current.hero.xp).toBe(0)
  })
})

describe('Round progression', () => {
  it('completing 5 challenges transitions phase to round-complete', () => {
    const result = setup()
    setupWithHero(result)
    act(() => result.current.selectWorld('egypt'))
    act(() => result.current.enterWorld(ROUND1[0]))
    playRound(result, ROUND1)
    expect(result.current.phase).toBe('round-complete')
  })

  it('round 1 completion advances currentRound to 2', () => {
    const result = setup()
    setupWithHero(result)
    act(() => result.current.selectWorld('egypt'))
    act(() => result.current.enterWorld(ROUND1[0]))
    playRound(result, ROUND1)
    expect(result.current.currentRound).toBe(2)
  })

  it('startNextRound transitions to world-entry', () => {
    const result = setup()
    setupWithHero(result)
    act(() => result.current.selectWorld('egypt'))
    act(() => result.current.enterWorld(ROUND1[0]))
    playRound(result, ROUND1)
    act(() => result.current.startNextRound())
    expect(result.current.phase).toBe('world-entry')
  })
})

describe('World progression', () => {
  it('completing all 3 rounds marks worlds[0].completed as true', () => {
    const result = setup()
    setupWithHero(result)
    act(() => result.current.selectWorld('egypt'))
    act(() => result.current.enterWorld(ROUND1[0]))
    playWorldRounds(result)
    expect(result.current.worldStates[0].completed).toBe(true)
  })

  it('completing world[0] unlocks worlds[1]', () => {
    const result = setup()
    setupWithHero(result)
    act(() => result.current.selectWorld('egypt'))
    act(() => result.current.enterWorld(ROUND1[0]))
    playWorldRounds(result)
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
