import { test, expect } from '@playwright/test'
import { goto, createHero } from './helpers.js'

/**
 * Answer each challenge in Egypt with correct/wrong pattern.
 * wrongSet: 0-based indices of questions to answer wrong BOTH times (0 XP, no first-attempt credit).
 * All others answered correct on first attempt.
 * Ends on world-complete screen.
 *
 * New flow: wrong 1st → stays on challenge → wrong 2nd → result (state C) → "Keep going →"
 */
async function completeEgypt(page, { wrongSet = [] } = {}) {
  await page.getByTestId('world-node-egypt').click()
  await page.getByTestId('world-entry-enter-btn').click()

  // Q1 — MCQ, correctIndex=1 (Khufu), wrongFirst=0 (Ramesses), wrongSecond=2 (Tutankhamun)
  if (wrongSet.includes(0)) {
    await page.getByTestId('mcq-option-0').click()       // wrong 1st → stays on challenge
    await page.getByTestId('mcq-option-2').click()       // wrong 2nd → result state C
    await page.getByTestId('result-continue-btn').click() // "Keep going →"
  } else {
    await page.getByTestId('mcq-option-1').click()
    await page.getByTestId('result-continue-btn').click()
  }

  // Q2 — number, correct='61', wrong1='99', wrong2='88'
  if (wrongSet.includes(1)) {
    await page.getByTestId('numberpad-key-9').click()
    await page.getByTestId('numberpad-key-9').click()
    await page.getByTestId('numberpad-submit').click()   // wrong 1st → stays on challenge
    await page.getByTestId('numberpad-key-8').click()
    await page.getByTestId('numberpad-key-8').click()
    await page.getByTestId('numberpad-submit').click()   // wrong 2nd → result state C
    await page.getByTestId('result-continue-btn').click()
  } else {
    await page.getByTestId('numberpad-key-6').click()
    await page.getByTestId('numberpad-key-1').click()
    await page.getByTestId('numberpad-submit').click()
    await page.getByTestId('result-continue-btn').click()
  }

  // Q3 — MCQ, correctIndex=1, wrongFirst=0, wrongSecond=2
  if (wrongSet.includes(2)) {
    await page.getByTestId('mcq-option-0').click()
    await page.getByTestId('mcq-option-2').click()
    await page.getByTestId('result-continue-btn').click()
  } else {
    await page.getByTestId('mcq-option-1').click()
    await page.getByTestId('result-continue-btn').click()
  }

  // Q4 — boss MCQ, correctIndex=2, boss has 1 attempt only
  if (wrongSet.includes(3)) {
    await page.getByTestId('mcq-option-0').click()       // wrong → result state C immediately
    await page.getByTestId('result-continue-btn').click()
  } else {
    await page.getByTestId('mcq-option-2').click()
    await page.getByTestId('result-continue-btn').click()
  }
  // Now on world-complete screen
}

test.describe('World Complete Screen', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page)
    await createHero(page)
  })

  // ----- Layout -----

  test('world complete screen is visible after all 4 challenges', async ({ page }) => {
    await completeEgypt(page)
    await expect(page.getByTestId('world-complete-screen')).toBeVisible()
  })

  test('shows "Ancient Egypt Complete!" in header', async ({ page }) => {
    await completeEgypt(page)
    await expect(page.getByText('Ancient Egypt Complete!')).toBeVisible()
  })

  test('shows trophy emoji', async ({ page }) => {
    await completeEgypt(page)
    await expect(page.getByTestId('world-complete-screen')).toContainText('🏆')
  })

  test('shows challenge count', async ({ page }) => {
    await completeEgypt(page)
    await expect(page.getByText(/4 challenges completed/)).toBeVisible()
  })

  test('Back to World Map button is present', async ({ page }) => {
    await completeEgypt(page)
    await expect(page.getByTestId('world-complete-back-btn')).toBeVisible()
    await expect(page.getByTestId('world-complete-back-btn')).toContainText('Back to World Map')
  })

  // ----- Star ratings -----

  test('4/4 first-attempt correct → PERFECT! heading', async ({ page }) => {
    await completeEgypt(page, { wrongSet: [] })
    await expect(page.getByTestId('world-complete-heading')).toContainText('PERFECT!')
  })

  test('3/4 first-attempt correct → PERFECT! heading', async ({ page }) => {
    await completeEgypt(page, { wrongSet: [0] }) // Q1 wrong both times = 0 first-attempt credit
    await expect(page.getByTestId('world-complete-heading')).toContainText('PERFECT!')
  })

  test('2/4 first-attempt correct → Great Job! heading', async ({ page }) => {
    await completeEgypt(page, { wrongSet: [0, 1] })
    await expect(page.getByTestId('world-complete-heading')).toContainText('Great Job!')
  })

  test('1/4 first-attempt correct → Well Done! heading', async ({ page }) => {
    await completeEgypt(page, { wrongSet: [0, 1, 2] })
    await expect(page.getByTestId('world-complete-heading')).toContainText('Well Done!')
  })

  test('0/4 first-attempt correct → Well Done! heading', async ({ page }) => {
    await completeEgypt(page, { wrongSet: [0, 1, 2, 3] })
    await expect(page.getByTestId('world-complete-heading')).toContainText('Well Done!')
  })

  test('PERFECT shows supportive message', async ({ page }) => {
    await completeEgypt(page, { wrongSet: [] })
    await expect(page.getByText('Amazing! You got almost everything right first try!')).toBeVisible()
  })

  test('Great Job shows supportive message', async ({ page }) => {
    await completeEgypt(page, { wrongSet: [0, 1] })
    await expect(page.getByText('Great work! A few more tries next time!')).toBeVisible()
  })

  test('Well Done shows supportive message', async ({ page }) => {
    await completeEgypt(page, { wrongSet: [0, 1, 2, 3] })
    await expect(page.getByText("You finished! Keep practising to earn more stars!")).toBeVisible()
  })

  test('unlock message for next world is shown', async ({ page }) => {
    await completeEgypt(page, { wrongSet: [] })
    await expect(page.getByText(/You unlocked/)).toBeVisible()
    await expect(page.getByText('Medieval Kingdom')).toBeVisible()
  })

  test('stars element is present after completing world', async ({ page }) => {
    await completeEgypt(page, { wrongSet: [] })
    await expect(page.getByTestId('world-complete-stars')).toBeVisible()
    await page.waitForTimeout(1500) // wait for 3-star animation (3 × 400ms)
    const starsText = await page.getByTestId('world-complete-stars').textContent()
    expect(starsText).toContain('⭐')
  })

  // ----- Navigation after completion -----

  test('Back to World Map returns to map screen', async ({ page }) => {
    await completeEgypt(page)
    await page.getByTestId('world-complete-back-btn').click()
    await expect(page.getByTestId('world-map-screen')).toBeVisible()
  })

  test('Medieval is unlocked on map after completing Egypt', async ({ page }) => {
    await completeEgypt(page)
    await page.getByTestId('world-complete-back-btn').click()
    const medievalNode = page.getByTestId('world-node-medieval')
    // Role-button div — check it's reachable (cursor pointer or aria)
    await expect(medievalNode).toBeVisible()
    await medievalNode.click()
    await expect(page.getByTestId('world-entry-screen')).toBeVisible()
  })

  test('Egypt shows stars on map after completion', async ({ page }) => {
    await completeEgypt(page)
    await page.getByTestId('world-complete-back-btn').click()
    await expect(page.getByTestId('world-node-egypt')).toContainText('⭐')
  })
})
