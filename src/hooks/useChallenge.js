import { useState, useRef, useCallback } from 'react'
import { fetchChallenge as generateChallenge } from '../services/claude.js'
import worlds from '../worlds/index.js'
import { ROUND_NAMES, totalChallengesInRound } from '../utils/rounds.js'

const WORLD_MAP = Object.fromEntries(worlds.map(w => [w.id, w]))

export default function useChallenge() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentData, setCurrentData] = useState(null)
  const prefetchedRef = useRef(null)

  const fetchChallenge = useCallback(async ({ hero, worldId, roundNumber, challengeNumber }) => {
    const world = WORLD_MAP[worldId]
    if (!world) throw new Error(`No world configured for worldId: "${worldId}"`)
    const rn = roundNumber ?? 1
    const roundName = ROUND_NAMES[rn - 1] ?? 'Explorer'
    const total = totalChallengesInRound(rn)
    setIsLoading(true)
    setError(null)
    try {
      const data = await generateChallenge({ hero, world, roundNumber: rn, roundName, challengeNumber, totalChallengesInRound: total })
      setCurrentData(data)
      return data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const prefetchNext = useCallback(({ hero, worldId, roundNumber, nextChallengeNumber }) => {
    const rn = roundNumber ?? 1
    const max = totalChallengesInRound(rn)
    if (nextChallengeNumber > max) return Promise.resolve(null)
    const world = WORLD_MAP[worldId]
    if (!world) return Promise.resolve(null)
    const roundName = ROUND_NAMES[rn - 1] ?? 'Explorer'
    const total = totalChallengesInRound(rn)
    const p = generateChallenge({ hero, world, roundNumber: rn, roundName, challengeNumber: nextChallengeNumber, totalChallengesInRound: total }).catch(() => null)
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
