import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchChallenge } from '../services/claude'

const MOCK_HERO = { name: 'Madhav', class: 'warrior', level: 1 }
const MOCK_WORLD = {
  name: 'Ancient Egypt',
  context: 'Ancient Egypt, 2560 BC. Pharaohs rule the land.',
}
const MOCK_CHALLENGE_NUMBER = 1

const VALID_MCQ = {
  type: 'mcq',
  question: 'Who built the Great Pyramid?',
  options: ['Ramesses II', 'Khufu', 'Tutankhamun', 'Cleopatra'],
  answer: 'Khufu',
  funFact: 'The Great Pyramid was built around 2560 BC.',
  narrative: 'You stand before the Great Pyramid!',
}

const VALID_NUMBER = {
  type: 'number',
  question: 'What is 24 + 37?',
  answer: 61,
  funFact: 'Ancient Egyptians invented decimal systems.',
  narrative: 'The pyramid builders need your help!',
}

function mockFetchSuccess(payload) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ content: [{ text: JSON.stringify(payload) }] }),
  })
}

const defaultArgs = {
  hero: MOCK_HERO,
  world: MOCK_WORLD,
  challengeNumber: MOCK_CHALLENGE_NUMBER,
}

describe('fetchChallenge - happy path', () => {
  beforeEach(() => vi.resetAllMocks())

  it('MCQ response returns correct shape with all required fields', async () => {
    mockFetchSuccess(VALID_MCQ)
    const result = await fetchChallenge(defaultArgs)
    expect(result.question).toBeDefined()
    expect(result.options).toBeDefined()
    expect(result.narrative).toBeDefined()
    expect(result.funFact).toBeDefined()
  })

  it('options array has exactly 4 items', async () => {
    mockFetchSuccess(VALID_MCQ)
    const result = await fetchChallenge(defaultArgs)
    expect(result.options).toHaveLength(4)
  })

  it('number response has answer as type number not string', async () => {
    mockFetchSuccess(VALID_NUMBER)
    const result = await fetchChallenge(defaultArgs)
    expect(typeof result.answer).toBe('number')
  })
})

describe('fetchChallenge - error handling', () => {
  beforeEach(() => vi.resetAllMocks())

  it('non-ok HTTP response throws an error', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 })
    await expect(fetchChallenge(defaultArgs)).rejects.toThrow('API error 500')
  })

  it('network failure propagates the error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
    await expect(fetchChallenge(defaultArgs)).rejects.toThrow('Network error')
  })
})

describe('fetchChallenge - prompt construction', () => {
  beforeEach(() => vi.resetAllMocks())

  it('fetch body contains the world context string', async () => {
    mockFetchSuccess(VALID_MCQ)
    await fetchChallenge(defaultArgs)
    const [, init] = global.fetch.mock.calls[0]
    const body = JSON.parse(init.body)
    expect(body.systemPrompt).toContain(MOCK_WORLD.context)
  })

  it('fetch body contains the hero name', async () => {
    mockFetchSuccess(VALID_MCQ)
    await fetchChallenge(defaultArgs)
    const [, init] = global.fetch.mock.calls[0]
    const body = JSON.parse(init.body)
    expect(body.systemPrompt).toContain(MOCK_HERO.name)
  })
})
