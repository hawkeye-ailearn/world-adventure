import { test, expect } from '@playwright/test'
import {
  goto, createHero, goToEgyptChallenge,
  answerQ1Correct, answerQ1WrongFirst, answerQ1WrongSecond,
  answerQ2WrongFirst,
  completeWorldAllWrong,
} from './helpers.js'

test.describe('Edge Cases', () => {
  // ----- Hint is reset between questions -----

  test('hint is not shown at the start of Q2 even after it appeared on Q1', async ({ page }) => {
    await goToEgyptChallenge(page)
    // Trigger hint on Q1 (wrong 1st → auto-shown)
    await answerQ1WrongFirst(page)
    await expect(page.getByTestId('hint-text')).toBeVisible()
    // Answer correctly on 2nd attempt → result → continue to Q2
    await answerQ1Correct(page)
    await page.getByTestId('result-continue-btn').click()
    // On Q2: hint should NOT be visible
    await expect(page.getByTestId('hint-text')).not.toBeVisible()
  })

  // ----- Hint slides in automatically, no button required -----

  test('hint appears automatically on challenge screen after wrong first attempt', async ({ page }) => {
    await goToEgyptChallenge(page)
    await expect(page.getByTestId('hint-text')).not.toBeVisible() // before any answer
    await answerQ1WrongFirst(page)
    await expect(page.getByTestId('hint-text')).toBeVisible()     // after wrong answer
  })

  // ----- Wrong 1st → correct 2nd → +50 XP -----

  test('correct on second attempt earns half XP (50)', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1WrongFirst(page)
    await answerQ1Correct(page)
    await expect(page.getByTestId('result-xp-earned')).toContainText('+50 XP')
    await expect(page.getByTestId('hero-bar-xp')).toHaveText('50')
  })

  // ----- World complete with all wrong still unlocks next world -----

  test('completing a world with 0 XP still unlocks the next world', async ({ page }) => {
    await goto(page)
    await createHero(page)
    await page.getByTestId('world-node-egypt').click()
    await page.getByTestId('world-entry-enter-btn').click()
    await completeWorldAllWrong(page)
    // Medieval should now be unlocked — clicking it enters world-entry
    await page.getByTestId('world-node-medieval').click()
    await expect(page.getByTestId('world-entry-screen')).toBeVisible()
  })

  test('completing a world with all wrong = 0 XP total', async ({ page }) => {
    await goto(page)
    await createHero(page)
    await page.getByTestId('world-node-egypt').click()
    await page.getByTestId('world-entry-enter-btn').click()
    await completeWorldAllWrong(page)
    // Enter medieval to check HeroBar
    await page.getByTestId('world-node-medieval').click()
    await page.getByTestId('world-entry-enter-btn').click()
    await expect(page.getByTestId('hero-bar-xp')).toHaveText('0')
  })

  // ----- Page reload resets game state -----

  test('page reload resets to landing screen', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1Correct(page)
    await page.reload()
    await expect(page.getByTestId('landing-screen')).toBeVisible()
  })

  test('XP resets to 0 after page reload', async ({ page }) => {
    await goto(page)
    await createHero(page)
    await page.getByTestId('world-node-egypt').click()
    await page.getByTestId('world-entry-enter-btn').click()
    await answerQ1Correct(page) // earn 100 XP
    await page.reload()
    // Create new hero and navigate to challenge to check HeroBar
    await page.getByTestId('begin-adventure-btn').click()
    await page.getByTestId('hero-name-input').fill('Test')
    await page.getByTestId('class-btn-warrior').click()
    await page.getByTestId('hero-submit-btn').click()
    await page.getByTestId('world-node-egypt').click()
    await page.getByTestId('world-entry-enter-btn').click()
    await expect(page.getByTestId('hero-bar-xp')).toHaveText('0')
  })

  // ----- Boss hint never appears (1 attempt, no wrong-first flow) -----

  test('boss challenge does not auto-show hint (only 1 attempt, no partial-wrong state)', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1Correct(page)
    await page.getByTestId('result-continue-btn').click()
    await page.getByTestId('numberpad-key-6').click()
    await page.getByTestId('numberpad-key-1').click()
    await page.getByTestId('numberpad-submit').click()
    await page.getByTestId('result-continue-btn').click()
    await page.getByTestId('mcq-option-1').click()
    await page.getByTestId('result-continue-btn').click()
    // Now on Q4 boss — hint should never appear
    await expect(page.getByTestId('hint-text')).not.toBeVisible()
  })

  // ----- NumberPad refuses empty submit -----

  test('NumberPad ✓ key is visually dimmed when display is empty', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1Correct(page)
    await page.getByTestId('result-continue-btn').click()
    // On Q2 with empty input — submit background should be dim (#2e3a60), not active purple
    const submitBg = await page.getByTestId('numberpad-submit').evaluate(el => el.style.background)
    expect(submitBg).not.toBe('rgb(83, 74, 183)') // not active purple #534AB7
  })

  // ----- MCQ buttons lock after submission -----

  test('MCQ option buttons are not shown on result screen (challenge screen dismounted)', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1Correct(page)
    // On result screen — MCQ buttons not visible
    await expect(page.getByTestId('result-screen')).toBeVisible()
    await expect(page.getByTestId('mcq-option-0')).not.toBeVisible()
  })

  // ----- Backspace then re-enter -----

  test('backspace then re-typing a correct answer still works', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1Correct(page)
    await page.getByTestId('result-continue-btn').click()
    // Q2: type a wrong digit, backspace, then type correct answer
    await page.getByTestId('numberpad-key-9').click()
    await page.getByTestId('numberpad-backspace').click()
    await page.getByTestId('numberpad-key-6').click()
    await page.getByTestId('numberpad-key-1').click()
    await page.getByTestId('numberpad-submit').click()
    await expect(page.getByTestId('result-xp-earned')).toContainText('+100 XP')
  })

  // ----- NumberPad resets after first wrong attempt -----

  test('NumberPad resets for second attempt after first wrong', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1Correct(page)
    await page.getByTestId('result-continue-btn').click()
    // Q2 wrong 1st (stays on challenge)
    await answerQ2WrongFirst(page)
    await expect(page.getByTestId('challenge-screen')).toBeVisible()
    // NumberPad should show '...' placeholder again (remounted with key={attemptsLeft})
    await expect(page.getByTestId('numberpad-display')).toContainText('...')
  })

  // ----- firstAttemptCorrect tracking -----

  test('firstAttemptCorrect tracking: 3 correct first try → PERFECT! (3 stars)', async ({ page }) => {
    await goto(page)
    await createHero(page)
    await page.getByTestId('world-node-egypt').click()
    await page.getByTestId('world-entry-enter-btn').click()

    // Q1 wrong both times (0 first-attempt correct)
    await page.getByTestId('mcq-option-0').click()
    await page.getByTestId('mcq-option-2').click()
    await page.getByTestId('result-continue-btn').click()

    // Q2 correct first try (1 first-attempt correct)
    await page.getByTestId('numberpad-key-6').click()
    await page.getByTestId('numberpad-key-1').click()
    await page.getByTestId('numberpad-submit').click()
    await page.getByTestId('result-continue-btn').click()

    // Q3 correct first try (2 first-attempt correct)
    await page.getByTestId('mcq-option-1').click()
    await page.getByTestId('result-continue-btn').click()

    // Q4 correct first try (3 first-attempt correct → 3 stars)
    await page.getByTestId('mcq-option-2').click()
    await page.getByTestId('result-continue-btn').click()

    await expect(page.getByTestId('world-complete-heading')).toContainText('PERFECT!')
  })
})
