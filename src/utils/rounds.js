export const ROUND_NAMES = ['Explorer', 'Adventurer', 'Champion']

export function totalChallengesInRound(roundNumber) {
  return roundNumber === 3 ? 6 : 5
}
