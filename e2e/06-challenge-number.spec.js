import { test, expect } from '@playwright/test'
import { goToEgyptChallenge, answerQ1Correct, answerQ2Correct, answerQ2WrongFirst, answerQ2WrongSecond } from './helpers.js'

/** Navigate to Q2 (math NumberPad challenge). */
async function goToQ2(page) {
  await goToEgyptChallenge(page)
  await answerQ1Correct(page)
  await page.getByTestId('result-continue-btn').click()
}

test.describe('Challenge Screen — NumberPad (Q2 math)', () => {
  test.beforeEach(async ({ page }) => {
    await goToQ2(page)
  })

  // ----- Arrival -----

  test('challenge screen visible on Q2', async ({ page }) => {
    await expect(page.getByTestId('challenge-screen')).toBeVisible()
  })

  test('shows the math question text', async ({ page }) => {
    await expect(page.getByText('How much is 24 + 37?')).toBeVisible()
  })

  test('numberpad display is visible', async ({ page }) => {
    await expect(page.getByTestId('numberpad-display')).toBeVisible()
  })

  test('display shows placeholder "..." when empty', async ({ page }) => {
    await expect(page.getByTestId('numberpad-display')).toContainText('...')
  })

  test('all digit keys 0–9 are present', async ({ page }) => {
    for (const d of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
      await expect(page.getByTestId(`numberpad-key-${d}`)).toBeVisible()
    }
  })

  test('backspace key is present', async ({ page }) => {
    await expect(page.getByTestId('numberpad-backspace')).toBeVisible()
  })

  test('submit key is present', async ({ page }) => {
    await expect(page.getByTestId('numberpad-submit')).toBeVisible()
  })

  test('boss banner is not shown on Q2', async ({ page }) => {
    await expect(page.getByTestId('boss-banner')).not.toBeVisible()
  })

  test('hint is NOT shown before any wrong answer', async ({ page }) => {
    await expect(page.getByTestId('hint-wrapper')).not.toBeVisible()
  })

  // ----- Input building -----

  test('pressing digit keys builds value in display', async ({ page }) => {
    await page.getByTestId('numberpad-key-6').click()
    await expect(page.getByTestId('numberpad-display')).toContainText('6')
    await page.getByTestId('numberpad-key-1').click()
    await expect(page.getByTestId('numberpad-display')).toContainText('61')
  })

  test('backspace removes the last digit', async ({ page }) => {
    await page.getByTestId('numberpad-key-6').click()
    await page.getByTestId('numberpad-key-1').click()
    await page.getByTestId('numberpad-backspace').click()
    await expect(page.getByTestId('numberpad-display')).toContainText('6')
  })

  test('backspace on empty display does nothing', async ({ page }) => {
    await page.getByTestId('numberpad-backspace').click()
    await expect(page.getByTestId('numberpad-display')).toContainText('...')
  })

  test('maximum of 5 digits enforced', async ({ page }) => {
    for (const d of ['1', '2', '3', '4', '5', '6']) {
      await page.getByTestId(`numberpad-key-${d}`).click()
    }
    await expect(page.getByTestId('numberpad-display')).toContainText('12345')
    const text = await page.getByTestId('numberpad-display').textContent()
    expect(text).not.toContain('123456')
  })

  test('submitting empty input does nothing (stays on challenge)', async ({ page }) => {
    await page.getByTestId('numberpad-submit').click()
    await expect(page.getByTestId('challenge-screen')).toBeVisible()
  })

  // ----- Correct answer -----

  test('correct number answer navigates to result screen', async ({ page }) => {
    await answerQ2Correct(page)
    await expect(page.getByTestId('result-screen')).toBeVisible()
  })

  test('correct answer shows +100 XP (first attempt)', async ({ page }) => {
    await answerQ2Correct(page)
    await expect(page.getByTestId('result-xp-earned')).toContainText('+100 XP')
  })

  test('correct answer shows reaction text', async ({ page }) => {
    await answerQ2Correct(page)
    await expect(page.getByText("Brilliant! You're a maths master!")).toBeVisible()
  })

  test('correct answer shows fun fact', async ({ page }) => {
    await answerQ2Correct(page)
    await expect(page.getByText(/ancient Egyptians invented one of the earliest decimal/)).toBeVisible()
  })

  test('correct answer shows "Continue →" button', async ({ page }) => {
    await answerQ2Correct(page)
    await expect(page.getByTestId('result-continue-btn')).toContainText('Continue →')
  })

  // ----- Wrong first attempt (stays on challenge) -----

  test('wrong first attempt stays on challenge screen', async ({ page }) => {
    await answerQ2WrongFirst(page)
    await expect(page.getByTestId('challenge-screen')).toBeVisible()
    await expect(page.getByTestId('result-screen')).not.toBeVisible()
  })

  test('hint auto-shows after wrong first attempt', async ({ page }) => {
    await answerQ2WrongFirst(page)
    await expect(page.getByTestId('hint-text')).toBeVisible()
    await expect(page.getByTestId('hint-text')).toContainText('tens')
  })

  test('hint contains tip about adding tens', async ({ page }) => {
    await answerQ2WrongFirst(page)
    await expect(page.getByTestId('hint-text')).toContainText('tens')
  })

  test('second correct attempt after wrong earns +50 XP', async ({ page }) => {
    await answerQ2WrongFirst(page)
    await answerQ2Correct(page) // second attempt
    await expect(page.getByTestId('result-xp-earned')).toContainText('+50 XP')
  })

  test('wrong on second attempt shows "Keep going →" (state C)', async ({ page }) => {
    await answerQ2WrongFirst(page)
    await answerQ2WrongSecond(page) // second wrong → result state C
    await expect(page.getByTestId('result-screen')).toBeVisible()
    await expect(page.getByTestId('result-continue-btn')).toContainText('Keep going →')
  })

  test('both wrong earns 0 XP', async ({ page }) => {
    await answerQ2WrongFirst(page)
    await answerQ2WrongSecond(page)
    await expect(page.getByTestId('result-xp-earned')).not.toBeVisible()
  })

  test('correct answer on result screen is shown after both wrong', async ({ page }) => {
    await answerQ2WrongFirst(page)
    await answerQ2WrongSecond(page)
    // State C shows answer as '✅ 61' (no 'Correct answer:' label)
    await expect(page.getByText('✅ 61')).toBeVisible()
  })
})
