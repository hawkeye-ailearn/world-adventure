/**
 * Shared helpers for World Quest e2e tests.
 *
 * Mock challenge answers (deterministic — see useGameState.js MOCK_CHALLENGES):
 *   Q1  history MCQ  options: ['Ramesses II','Khufu','Tutankhamun','Cleopatra']  correctIndex: 1
 *   Q2  math    num  correctAnswer: '61'
 *   Q3  general MCQ  options: ['Melting snow…','Rich fertile soil…','Golden nuggets','Cool river breezes']  correctIndex: 1
 *   Q4  boss    MCQ  options: ['3','4','5','6']  correctIndex: 2
 *
 * --- Two-attempt flow (main branch, no Try-Again button) ---
 * Wrong on first attempt  → stays on CHALLENGE screen, hint auto-shows, wrong option goes red+disabled
 * Correct on 2nd attempt  → goes to RESULT (state B, +50 XP), "Continue →"
 * Wrong on 2nd attempt    → goes to RESULT (state C, 0 XP), "Keep going →"
 * Boss: 1 attempt only    → wrong goes straight to RESULT (state C), "Keep going →"
 */

/** Navigate to the app root (resets all React state). */
export async function goto(page) {
  await page.goto('/')
}

/**
 * Complete the hero creation flow from landing → world-map.
 * @param {{ name?: string, heroClass?: 'warrior'|'wizard'|'explorer' }} options
 */
export async function createHero(page, { name = 'Madhav', heroClass = 'warrior' } = {}) {
  await page.getByTestId('begin-adventure-btn').click()
  await page.getByTestId('hero-name-input').fill(name)
  await page.getByTestId(`class-btn-${heroClass}`).click()
  await page.getByTestId('hero-submit-btn').click()
}

/**
 * Navigate all the way to the Egypt challenge screen (Q1).
 * Leaves the page on `challenge-screen` showing Q1.
 */
export async function goToEgyptChallenge(page, options = {}) {
  await goto(page)
  await createHero(page, options)
  await page.getByTestId('world-node-egypt').click()
  await page.getByTestId('world-entry-enter-btn').click()
}

// --------------------------------------------------------------------------
// Per-question answer helpers (call when that question is on screen)
// --------------------------------------------------------------------------

/** Q1 history MCQ — correct (Khufu, index 1) */
export async function answerQ1Correct(page) {
  await page.getByTestId('mcq-option-1').click()
}

/** Q1 history MCQ — wrong first attempt (Ramesses II, index 0). Stays on challenge. */
export async function answerQ1WrongFirst(page) {
  await page.getByTestId('mcq-option-0').click()
}

/**
 * Q1 history MCQ — wrong second attempt (Tutankhamun, index 2).
 * Option 0 is disabled after being picked first, so pick a different wrong option.
 * Goes to result (state C).
 */
export async function answerQ1WrongSecond(page) {
  await page.getByTestId('mcq-option-2').click()
}

/** Q2 math number — correct (61) */
export async function answerQ2Correct(page) {
  await page.getByTestId('numberpad-key-6').click()
  await page.getByTestId('numberpad-key-1').click()
  await page.getByTestId('numberpad-submit').click()
}

/** Q2 math number — wrong (99). Stays on challenge (first attempt). */
export async function answerQ2WrongFirst(page) {
  await page.getByTestId('numberpad-key-9').click()
  await page.getByTestId('numberpad-key-9').click()
  await page.getByTestId('numberpad-submit').click()
}

/** Q2 math number — wrong second attempt (88). Goes to result state C. */
export async function answerQ2WrongSecond(page) {
  await page.getByTestId('numberpad-key-8').click()
  await page.getByTestId('numberpad-key-8').click()
  await page.getByTestId('numberpad-submit').click()
}

/** Q3 general MCQ — correct (Rich fertile soil, index 1) */
export async function answerQ3Correct(page) {
  await page.getByTestId('mcq-option-1').click()
}

/** Q3 general MCQ — wrong first attempt (Melting snow, index 0). Stays on challenge. */
export async function answerQ3WrongFirst(page) {
  await page.getByTestId('mcq-option-0').click()
}

/** Q3 general MCQ — wrong second attempt (Golden nuggets, index 2). Goes to result state C. */
export async function answerQ3WrongSecond(page) {
  await page.getByTestId('mcq-option-2').click()
}

/** Q4 boss MCQ — correct ('5', index 2) */
export async function answerQ4Correct(page) {
  await page.getByTestId('mcq-option-2').click()
}

/** Q4 boss MCQ — wrong ('3', index 0). Boss has 1 attempt → goes straight to result state C. */
export async function answerQ4Wrong(page) {
  await page.getByTestId('mcq-option-0').click()
}

// --------------------------------------------------------------------------
// Composite helpers
// --------------------------------------------------------------------------

/**
 * Complete the current world with all 4 answers correct on first attempt.
 * Starts on challenge screen (Q1) and ends on world-map (or game-complete).
 */
export async function completeWorldAllCorrect(page) {
  // Q1 — history MCQ (correct first try → result → continue)
  await answerQ1Correct(page)
  await page.getByTestId('result-continue-btn').click()

  // Q2 — math number (correct first try → result → continue)
  await answerQ2Correct(page)
  await page.getByTestId('result-continue-btn').click()

  // Q3 — general MCQ (correct first try → result → continue)
  await answerQ3Correct(page)
  await page.getByTestId('result-continue-btn').click()

  // Q4 — boss MCQ (correct first try → result → continue)
  await answerQ4Correct(page)
  await page.getByTestId('result-continue-btn').click()

  // world-complete → back to map (or game-complete)
  await page.getByTestId('world-complete-back-btn').click()
}

/**
 * Complete the current world answering every question wrong both times (0 XP).
 * Ends on world-map (or game-complete).
 *
 * Flow: wrong 1st (stays on challenge) → wrong 2nd (→ result state C) → "Keep going →"
 */
export async function completeWorldAllWrong(page) {
  // Q1: wrong first (stays on challenge) → wrong second (→ result)
  await answerQ1WrongFirst(page)
  await answerQ1WrongSecond(page)
  await page.getByTestId('result-continue-btn').click() // "Keep going →"

  // Q2: wrong first (stays on challenge, NumberPad remounts) → wrong second (→ result)
  await answerQ2WrongFirst(page)
  await answerQ2WrongSecond(page)
  await page.getByTestId('result-continue-btn').click()

  // Q3: wrong first → wrong second → result
  await answerQ3WrongFirst(page)
  await answerQ3WrongSecond(page)
  await page.getByTestId('result-continue-btn').click()

  // Q4 boss: one attempt only, wrong → result
  await answerQ4Wrong(page)
  await page.getByTestId('result-continue-btn').click()

  // world-complete → back to map
  await page.getByTestId('world-complete-back-btn').click()
}

/**
 * Worlds in play order, used by the full-game test.
 */
export const WORLD_NODES = [
  'world-node-egypt',
  'world-node-medieval',
  'world-node-space',
  'world-node-safari',
  'world-node-india',
]
