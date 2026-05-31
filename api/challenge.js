export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, systemPrompt } = req.body

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        system: systemPrompt,
        messages,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      let errorMessage = 'Anthropic API error'
      try {
        const errData = JSON.parse(errText)
        errorMessage = errData.error?.message || errorMessage
      } catch { /* non-JSON error body */ }
      console.error('Anthropic rejected request:', errText)
      return res.status(response.status).json({ error: errorMessage })
    }

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('API error:', err)
    res.status(500).json({ error: err.message })
  }
}
