import { test, expect } from '@playwright/test'
import {
  goto, createHero, goToEgyptChallenge,
  answerQ1Correct, answerQ1WrongFirst, answerQ1WrongSecond,
  answerQ2Correct, answerQ3Correct, answerQ4Correct,
} from './helpers.js'

test.describe('XP and Levelling', () => {
  test('hero starts with 0 XP on first challenge', async ({ page }) => {
    await goto(page)
    await createHero(page)
    // HeroBar is only shown inside challenge/result screens, not on world-map
    await page.getByTestId('world-node-egypt').click()
    await page.getByTestId('world-entry-enter-btn').click()
    await expect(page.getByTestId('hero-bar-xp')).toHaveText('0')
  })

  test('first-attempt correct awards +100 XP', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1Correct(page)
    await expect(page.getByTestId('hero-bar-xp')).toHaveText('100')
    await expect(page.getByTestId('result-xp-earned')).toContainText('+100 XP')
  })

  test('second-attempt correct awards +50 XP', async ({ page }) => {
    await goToEgyptChallenge(page)
    // Wrong first (stays on challenge), correct second
    await answerQ1WrongFirst(page)
    await answerQ1Correct(page)
    await expect(page.getByTestId('result-xp-earned')).toContainText('+50 XP')
    await expect(page.getByTestId('hero-bar-xp')).toHaveText('50')
  })

  test('both wrong attempts award 0 XP', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1WrongFirst(page)
    await answerQ1WrongSecond(page) // → result state C
    await expect(page.getByTestId('result-xp-earned')).not.toBeVisible()
    await expect(page.getByTestId('hero-bar-xp')).toHaveText('0')
  })

  test('XP does not decrease after a wrong answer', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1Correct(page) // +100 XP
    await page.getByTestId('result-continue-btn').click()
    // Q2 wrong first (stays on challenge)
    await page.getByTestId('numberpad-key-9').click()
    await page.getByTestId('numberpad-key-9').click()
    await page.getByTestId('numberpad-submit').click()
    // Still on challenge screen — XP should still be 100
    await expect(page.getByTestId('hero-bar-xp')).toHaveText('100')
  })

  test('boss challenge correct on first attempt awards +200 XP', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1Correct(page)
    await page.getByTestId('result-continue-btn').click()
    await answerQ2Correct(page)
    await page.getByTestId('result-continue-btn').click()
    await answerQ3Correct(page)
    await page.getByTestId('result-continue-btn').click()
    await answerQ4Correct(page)
    await expect(page.getByTestId('result-xp-earned')).toContainText('+200 XP')
  })

  test('total XP after all 4 correct first-try = 500', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1Correct(page)
    await page.getByTestId('result-continue-btn').click()
    await answerQ2Correct(page)
    await page.getByTestId('result-continue-btn').click()
    await answerQ3Correct(page)
    await page.getByTestId('result-continue-btn').click()
    await answerQ4Correct(page)
    // 100+100+100+200 = 500 XP total
    await expect(page.getByTestId('hero-bar-xp')).toHaveText('500')
  })

  test('level-up to Lv 2 Explorer after crossing 300 XP', async ({ page }) => {
    // All-correct Egypt run → 500 XP, crosses 300 threshold
    await goToEgyptChallenge(page)
    await answerQ1Correct(page)
    await page.getByTestId('result-continue-btn').click()
    await answerQ2Correct(page)
    await page.getByTestId('result-continue-btn').click()
    await answerQ3Correct(page)
    await page.getByTestId('result-continue-btn').click()
    await answerQ4Correct(page)
    await expect(page.getByTestId('hero-bar-level')).toContainText('Lv 2')
    await expect(page.getByTestId('hero-bar-level')).toContainText('Explorer')
  })

  test('level-up banner appears on result screen when crossing a threshold', async ({ page }) => {
    // Q1+Q2+Q3 correct = 300 XP → crosses into Explorer on Q3 result
    await goToEgyptChallenge(page)
    await answerQ1Correct(page)
    await page.getByTestId('result-continue-btn').click()
    await answerQ2Correct(page)
    await page.getByTestId('result-continue-btn').click()
    await answerQ3Correct(page)
    // At Q3 result: totalXP = 300 → level-up banner should appear
    await expect(page.getByText('Level Up!')).toBeVisible()
    await expect(page.getByText('Explorer')).toBeVisible()
  })

  test('result screen shows total XP alongside earned XP', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1Correct(page) // +100, total = 100
    await expect(page.getByTestId('result-xp-earned')).toContainText('100 total')
  })

  test('XP accumulates across questions in the same world', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1Correct(page) // 100 XP
    await page.getByTestId('result-continue-btn').click()
    await answerQ2Correct(page) // 200 XP total
    await expect(page.getByTestId('hero-bar-xp')).toHaveText('200')
    await expect(page.getByTestId('result-xp-earned')).toContainText('200 total')
  })

  test('level stays at Lv 1 Apprentice below 300 XP', async ({ page }) => {
    await goToEgyptChallenge(page)
    await answerQ1Correct(page) // 100 XP — still level 1
    await expect(page.getByTestId('hero-bar-level')).toContainText('Lv 1')
    await expect(page.getByTestId('hero-bar-level')).toContainText('Apprentice')
  })
})
