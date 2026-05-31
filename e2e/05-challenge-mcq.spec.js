import { test, expect } from '@playwright/test'
import { goToEgyptChallenge, answerQ1Correct, answerQ1WrongFirst, answerQ1WrongSecond } from './helpers.js'

test.describe('Challenge Screen — MCQ (Q1 history)', () => {
  test.beforeEach(async ({ page }) => {
    await goToEgyptChallenge(page)
  })

  // ----- Arrival -----

  test('challenge screen is visible on entry', async ({ page }) => {
    await expect(page.getByTestId('challenge-screen')).toBeVisible()
  })

  test('shows the narrative text', async ({ page }) => {
    await expect(page.getByText('You stand before the Great Pyramid of Giza!')).toBeVisible()
  })

  test('shows the question', async ({ page }) => {
    await expect(page.getByText('Who built the Great Pyramid of Giza?')).toBeVisible()
  })

  test('shows all 4 MCQ option buttons', async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      await expect(page.getByTestId(`mcq-option-${i}`)).toBeVisible()
    }
  })

  test('MCQ options show the correct answer text', async ({ page }) => {
    await expect(page.getByTestId('mcq-option-0')).toContainText('Ramesses II')
    await expect(page.getByTestId('mcq-option-1')).toContainText('Khufu')
    await expect(page.getByTestId('mcq-option-2')).toContainText('Tutankhamun')
    await expect(page.getByTestId('mcq-option-3')).toContainText('Cleopatra')
  })

  test('MCQ options show A/B/C/D letter labels', async ({ page }) => {
    await expect(page.getByTestId('mcq-option-0')).toContainText('A')
    await expect(page.getByTestId('mcq-option-1')).toContainText('B')
    await expect(page.getByTestId('mcq-option-2')).toContainText('C')
    await expect(page.getByTestId('mcq-option-3')).toContainText('D')
  })

  test('shows 2 hearts for regular challenge', async ({ page }) => {
    const hearts = page.locator('[style*="font-size: 18"]').filter({ hasText: '❤️' })
    await expect(hearts).toHaveCount(2)
  })

  test('boss banner is not shown on Q1', async ({ page }) => {
    await expect(page.getByTestId('boss-banner')).not.toBeVisible()
  })

  test('hint is NOT shown before any wrong answer', async ({ page }) => {
    await expect(page.getByTestId('hint-text')).not.toBeVisible()
  })

  test('HeroBar shows hero name', async ({ page }) => {
    await expect(page.getByTestId('hero-bar')).toContainText('Madhav')
  })

  // ----- Correct first attempt -----

  test.describe('correct answer on first attempt', () => {
    test.beforeEach(async ({ page }) => {
      await answerQ1Correct(page)
    })

    test('navigates to result screen', async ({ page }) => {
      await expect(page.getByTestId('result-screen')).toBeVisible()
    })

    test('result shows reaction text', async ({ page }) => {
      await expect(page.getByText('Outstanding! You really know your pharaohs!')).toBeVisible()
    })

    test('result shows +100 XP earned', async ({ page }) => {
      await expect(page.getByTestId('result-xp-earned')).toContainText('+100 XP')
    })

    test('result shows Fun Fact section', async ({ page }) => {
      await expect(page.getByText('Fun Fact!')).toBeVisible()
      await expect(page.getByText(/Great Pyramid of Giza was built/)).toBeVisible()
    })

    test('result shows "Continue →" button', async ({ page }) => {
      await expect(page.getByTestId('result-continue-btn')).toContainText('Continue →')
    })

    test('HeroBar XP updates to 100', async ({ page }) => {
      await expect(page.getByTestId('hero-bar-xp')).toHaveText('100')
    })

    test('clicking Continue advances to Q2', async ({ page }) => {
      await page.getByTestId('result-continue-btn').click()
      await expect(page.getByTestId('challenge-screen')).toBeVisible()
      await expect(page.getByText('24 + 37')).toBeVisible()
    })
  })

  // ----- Wrong first attempt (stays on challenge) -----

  test.describe('wrong answer on first attempt', () => {
    test.beforeEach(async ({ page }) => {
      await answerQ1WrongFirst(page) // click Ramesses II (index 0)
    })

    test('stays on challenge screen after first wrong', async ({ page }) => {
      // New flow: wrong first attempt stays on challenge, does NOT go to result
      await expect(page.getByTestId('challenge-screen')).toBeVisible()
      await expect(page.getByTestId('result-screen')).not.toBeVisible()
    })

    test('hint is auto-shown after wrong first attempt', async ({ page }) => {
      await expect(page.getByTestId('hint-text')).toBeVisible()
      await expect(page.getByTestId('hint-text')).toContainText('4th dynasty')
    })

    test('wrong option is visually marked red and disabled', async ({ page }) => {
      // Ramesses II (option 0) should have red styling — verify it's disabled
      const wrongOpt = page.getByTestId('mcq-option-0')
      await expect(wrongOpt).toBeDisabled()
    })

    test('HeroBar XP is still 0 after first wrong', async ({ page }) => {
      await expect(page.getByTestId('hero-bar-xp')).toHaveText('0')
    })

    // ----- Second attempt correct -----

    test.describe('correct on second attempt', () => {
      test.beforeEach(async ({ page }) => {
        await answerQ1Correct(page) // Khufu (index 1) — correct
      })

      test('navigates to result screen (state B)', async ({ page }) => {
        await expect(page.getByTestId('result-screen')).toBeVisible()
      })

      test('result shows +50 XP (half XP for second attempt)', async ({ page }) => {
        await expect(page.getByTestId('result-xp-earned')).toContainText('+50 XP')
        await expect(page.getByTestId('hero-bar-xp')).toHaveText('50')
      })

      test('result shows "Continue →" button (not "Keep going →")', async ({ page }) => {
        await expect(page.getByTestId('result-continue-btn')).toContainText('Continue →')
      })

      test('result shows reaction text', async ({ page }) => {
        await expect(page.getByText('Outstanding! You really know your pharaohs!')).toBeVisible()
      })
    })

    // ----- Second attempt also wrong -----

    test.describe('wrong on second attempt', () => {
      test.beforeEach(async ({ page }) => {
        await answerQ1WrongSecond(page) // Tutankhamun (index 2) — also wrong
      })

      test('navigates to result screen (state C)', async ({ page }) => {
        await expect(page.getByTestId('result-screen')).toBeVisible()
      })

      test('result shows 0 XP (xp panel hidden)', async ({ page }) => {
        await expect(page.getByTestId('result-xp-earned')).not.toBeVisible()
      })

      test('result shows correct answer', async ({ page }) => {
        // State C shows the correct answer
        await expect(page.getByText('Khufu')).toBeVisible()
      })

      test('result shows "Keep going →" button (state C)', async ({ page }) => {
        await expect(page.getByTestId('result-continue-btn')).toContainText('Keep going →')
      })

      test('HeroBar XP stays at 0', async ({ page }) => {
        await expect(page.getByTestId('hero-bar-xp')).toHaveText('0')
      })
    })
  })

  // ----- State C advances to next challenge -----

  test('"Keep going →" after both wrong advances to Q2', async ({ page }) => {
    await answerQ1WrongFirst(page)
    await answerQ1WrongSecond(page)
    await page.getByTestId('result-continue-btn').click() // "Keep going →"
    await expect(page.getByTestId('challenge-screen')).toBeVisible()
    await expect(page.getByText('24 + 37')).toBeVisible()
  })
})
