import { test, expect } from '@playwright/test'
import { goToEgyptChallenge, answerQ1Correct, answerQ2Correct, answerQ3Correct, answerQ4Correct, answerQ4Wrong } from './helpers.js'

/** Navigate to Q4 (boss challenge). */
async function goToBoss(page) {
  await goToEgyptChallenge(page)
  await answerQ1Correct(page)
  await page.getByTestId('result-continue-btn').click()
  await answerQ2Correct(page)
  await page.getByTestId('result-continue-btn').click()
  await answerQ3Correct(page)
  await page.getByTestId('result-continue-btn').click()
}

test.describe('Boss Challenge (Q4)', () => {
  test.beforeEach(async ({ page }) => {
    await goToBoss(page)
  })

  // ----- Arrival -----

  test('challenge screen visible on Q4', async ({ page }) => {
    await expect(page.getByTestId('challenge-screen')).toBeVisible()
  })

  test('shows ⚠️ BOSS CHALLENGE! banner', async ({ page }) => {
    await expect(page.getByTestId('boss-banner')).toBeVisible()
    await expect(page.getByTestId('boss-banner')).toContainText('BOSS CHALLENGE!')
  })

  test('shows only 1 heart for boss challenge', async ({ page }) => {
    const hearts = page.locator('[style*="font-size: 18"]').filter({ hasText: '❤️' })
    await expect(hearts).toHaveCount(1)
  })

  test('shows boss question text', async ({ page }) => {
    await expect(page.getByText('How many faces does a pyramid have in total')).toBeVisible()
  })

  test('shows 4 MCQ options including correct answer "5"', async ({ page }) => {
    await expect(page.getByTestId('mcq-option-0')).toContainText('3')
    await expect(page.getByTestId('mcq-option-1')).toContainText('4')
    await expect(page.getByTestId('mcq-option-2')).toContainText('5')
    await expect(page.getByTestId('mcq-option-3')).toContainText('6')
  })

  test('hint NOT shown before any answer on boss (boss has 1 attempt, no auto-hint)', async ({ page }) => {
    await expect(page.getByTestId('hint-wrapper')).not.toBeVisible()
  })

  // ----- Correct boss answer -----

  test.describe('correct boss answer', () => {
    test.beforeEach(async ({ page }) => {
      await answerQ4Correct(page) // '5'
    })

    test('navigates to result screen', async ({ page }) => {
      await expect(page.getByTestId('result-screen')).toBeVisible()
    })

    test('result shows +200 XP', async ({ page }) => {
      await expect(page.getByTestId('result-xp-earned')).toContainText('+200 XP')
    })

    test('result shows trophy or star emoji (state A, boss correct)', async ({ page }) => {
      // State A boss: icon is 🏆
      await expect(page.getByTestId('result-screen')).toContainText('🏆')
    })

    test('result shows legendary reaction text', async ({ page }) => {
      await expect(page.getByText('LEGENDARY! The Sphinx bows before your incredible knowledge!')).toBeVisible()
    })

    test('result shows fun fact about pyramid faces', async ({ page }) => {
      await expect(page.getByText(/square pyramid has 4 triangular faces/)).toBeVisible()
    })

    test('result shows "Continue →" button', async ({ page }) => {
      await expect(page.getByTestId('result-continue-btn')).toContainText('Continue →')
    })

    test('clicking Continue leads to world-complete screen', async ({ page }) => {
      await page.getByTestId('result-continue-btn').click()
      await expect(page.getByTestId('world-complete-screen')).toBeVisible()
    })
  })

  // ----- Wrong boss answer -----

  test.describe('wrong boss answer (1 attempt only — goes straight to result)', () => {
    test.beforeEach(async ({ page }) => {
      await answerQ4Wrong(page) // '3' — wrong; boss has only 1 attempt
    })

    test('navigates to result screen (state C)', async ({ page }) => {
      await expect(page.getByTestId('result-screen')).toBeVisible()
    })

    test('shows "Keep going →" (state C, no retry on boss)', async ({ page }) => {
      await expect(page.getByTestId('result-continue-btn')).toContainText('Keep going →')
    })

    test('earns 0 XP', async ({ page }) => {
      await expect(page.getByTestId('result-xp-earned')).not.toBeVisible()
    })

    test('shows correct answer on result screen', async ({ page }) => {
      // State C shows answer as '✅ 5' (no 'Correct answer:' label)
      await expect(page.getByText('✅ 5')).toBeVisible()
    })

    test('clicking Keep Going leads to world-complete screen', async ({ page }) => {
      await page.getByTestId('result-continue-btn').click()
      await expect(page.getByTestId('world-complete-screen')).toBeVisible()
    })
  })
})
