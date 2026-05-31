import { useState, useRef, useCallback } from 'react'
import { fetchChallenge as generateChallenge } from '../services/claude.js'
import worlds from '../worlds/index.js'

const WORLD_MAP = Object.fromEntries(worlds.map(w => [w.id, w]))

export default function useChallenge() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentData, setCurrentData] = useState(null)
  const prefetchedRef = useRef(null)

  const fetchChallenge = useCallback(async ({ hero, worldId, challengeNumber }) => {
    const world = WORLD_MAP[worldId]
    if (!world) throw new Error(`No world configured for worldId: "${worldId}"`)
    setIsLoading(true)
    setError(null)
    try {
      const data = await generateChallenge({ hero, world, challengeNumber })
      setCurrentData(data)
      return data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const prefetchNext = useCallback(({ hero, worldId, nextChallengeNumber }) => {
    if (nextChallengeNumber > 4) return Promise.resolve(null)
    const world = WORLD_MAP[worldId]
    if (!world) return Promise.resolve(null)
    const p = generateChallenge({ hero, world, challengeNumber: nextChallengeNumber }).catch(() => null)
    prefetchedRef.current = p
    return p
  }, [])

  const clearChallenge = useCallback(() => {
    setCurrentData(null)
    setError(null)
    prefetchedRef.current = null
  }, [])

  return { fetchChallenge, prefetchNext, clearChallenge, currentData, isLoading, error }
}
