import { buildSystemPrompt } from '../constants/prompts.js'

export async function fetchChallenge({ hero, world, challengeNumber }) {
  const systemPrompt = buildSystemPrompt({ hero, world, challengeNumber })

  const res = await fetch('/api/challenge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt,
      messages: [{ role: 'user', content: 'Generate the challenge now. Return only valid JSON.' }],
    }),
  })

  if (!res.ok) throw new Error(`API error ${res.status}`)

  const data = await res.json()
  const text = data.content?.[0]?.text ?? ''
  return JSON.parse(text)
}
