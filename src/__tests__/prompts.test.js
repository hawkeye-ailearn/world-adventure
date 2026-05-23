import { describe, it, expect } from 'vitest'
import { buildSystemPrompt } from '../constants/prompts'

const MOCK_HERO = { name: 'Madhav', class: 'warrior', level: 1 }
const MOCK_WORLD = {
  name: 'Ancient Egypt',
  context: 'Ancient Egypt, 2560 BC. Pharaohs rule the land.',
}

function getPrompt(challengeNumber = 1) {
  return buildSystemPrompt({ hero: MOCK_HERO, world: MOCK_WORLD, challengeNumber })
}

describe('buildSystemPrompt - structure', () => {
  it('returns a non-empty string over 100 chars', () => {
    const prompt = getPrompt()
    expect(typeof prompt).toBe('string')
    expect(prompt.length).toBeGreaterThan(100)
  })

  it('contains the hero name', () => {
    expect(getPrompt()).toContain(MOCK_HERO.name)
  })

  it('contains the world name', () => {
    expect(getPrompt()).toContain(MOCK_WORLD.name)
  })

  it('contains the world context', () => {
    expect(getPrompt()).toContain(MOCK_WORLD.context)
  })
})

describe('buildSystemPrompt - JSON contract', () => {
  it('prompt contains the word json (case insensitive)', () => {
    expect(getPrompt().toLowerCase()).toContain('json')
  })

  it('prompt references question field', () => {
    expect(getPrompt()).toContain('question')
  })

  it('prompt references answer field', () => {
    expect(getPrompt()).toContain('answer')
  })

  it('prompt references funFact field', () => {
    expect(getPrompt()).toContain('funFact')
  })

  it('prompt references both question types: mcq and number', () => {
    const prompt = getPrompt()
    expect(prompt).toContain('mcq')
    expect(prompt).toContain('number')
  })
})

describe('buildSystemPrompt - age appropriateness', () => {
  it('prompt contains age reference matching /age|7|kid|child|year.old/i', () => {
    expect(getPrompt()).toMatch(/age|7|kid|child|year.old/i)
  })
})
