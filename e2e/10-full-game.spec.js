import { test, expect } from '@playwright/test'
import { goto, createHero, completeWorldAllCorrect, WORLD_NODES } from './helpers.js'

/**
 * Full 5-world playthrough tests.
 * These are intentionally slow — each test plays through all 5 worlds.
 * Timeout raised to 2 minutes.
 */

test.describe('Full Game Playthrough', () => {
  test.setTimeout(120_000)

  /** Helper: complete the full game and return to the game-complete screen. */
  async function playFullGame(page, { heroClass = 'warrior' } = {}) {
    await goto(page)
    await createHero(page, { name: 'Madhav', heroClass })

    for (const nodeId of WORLD_NODES) {
      await page.getByTestId(nodeId).click()
      await page.getByTestId('world-entry-enter-btn').click()
      await completeWorldAllCorrect(page)
    }
  }

  test('completing all 5 worlds shows game-complete screen', async ({ page }) => {
    await playFullGame(page)
    await expect(page.getByTestId('game-complete-screen')).toBeVisible()
  })

  test('game-complete shows "Quest Complete!" heading', async ({ page }) => {
    await playFullGame(page)
    await expect(page.getByText('Quest Complete!')).toBeVisible()
  })

  test('game-complete shows "You conquered all 5 worlds!"', async ({ page }) => {
    await playFullGame(page)
    await expect(page.getByText('You conquered all 5 worlds!')).toBeVisible()
  })

  test('game-complete shows the hero name', async ({ page }) => {
    await playFullGame(page)
    await expect(page.getByTestId('game-complete-screen')).toContainText('Madhav')
  })

  test('game-complete shows hero title (Warrior class)', async ({ page }) => {
    await playFullGame(page, { heroClass: 'warrior' })
    await expect(page.getByTestId('game-complete-screen')).toContainText('Warrior')
  })

  test('game-complete shows hero title (Wizard class)', async ({ page }) => {
    await playFullGame(page, { heroClass: 'wizard' })
    await expect(page.getByTestId('game-complete-screen')).toContainText('Wizard')
  })

  test('game-complete shows hero title (Explorer class)', async ({ page }) => {
    await playFullGame(page, { heroClass: 'explorer' })
    await expect(page.getByTestId('game-complete-screen')).toContainText('Explorer')
  })

  test('hero reaches Legend level (1200+ XP) at end of full game', async ({ page }) => {
    // All-correct: 5 worlds × 500 XP = 2500 XP > 1200 → Legend
    await playFullGame(page)
    await expect(page.getByTestId('game-complete-screen')).toContainText('Legend')
  })

  test('game-complete shows total XP of 2500 for all-perfect run', async ({ page }) => {
    // 5 worlds × (100+100+100+200) = 5 × 500 = 2500
    await playFullGame(page)
    await expect(page.getByTestId('game-complete-screen')).toContainText('2500')
  })

  test('game-complete shows all 5 world emojis', async ({ page }) => {
    await playFullGame(page)
    const content = await page.getByTestId('game-complete-screen').textContent()
    expect(content).toContain('🏺')
    expect(content).toContain('🏰')
    expect(content).toContain('🚀')
    expect(content).toContain('🦁')
    expect(content).toContain('🪔')
  })

  test('game-complete shows "play again" instruction text', async ({ page }) => {
    await playFullGame(page)
    await expect(page.getByText(/refresh to play again/i)).toBeVisible()
  })

  test('world map shows ✅ on all 4 intermediate worlds before final', async ({ page }) => {
    await goto(page)
    await createHero(page)

    // Complete first 4 worlds only
    for (const nodeId of WORLD_NODES.slice(0, 4)) {
      await page.getByTestId(nodeId).click()
      await page.getByTestId('world-entry-enter-btn').click()
      await completeWorldAllCorrect(page)
    }

    // Check first 4 have ✅
    for (const nodeId of WORLD_NODES.slice(0, 4)) {
      await expect(page.getByTestId(nodeId)).toContainText('✅')
    }
    // India not yet complete
    await expect(page.getByTestId('world-node-india')).not.toContainText('✅')
  })

  test('India unlocks after completing Safari', async ({ page }) => {
    await goto(page)
    await createHero(page)

    // Complete worlds up to and including Safari
    for (const nodeId of WORLD_NODES.slice(0, 4)) {
      await page.getByTestId(nodeId).click()
      await page.getByTestId('world-entry-enter-btn').click()
      await completeWorldAllCorrect(page)
    }

    const cursor = await page
      .getByTestId('world-node-india')
      .evaluate(el => window.getComputedStyle(el).cursor)
    expect(cursor).toBe('pointer')
  })

  test('each world entry shows the correct narrative', async ({ page }) => {
    await goto(page)
    await createHero(page)

    // Just verify the entry narrative for a couple of worlds
    await page.getByTestId('world-node-egypt').click()
    await expect(page.getByText(/golden sands of Ancient Egypt/)).toBeVisible()
    await page.getByTestId('world-entry-enter-btn').click()
    await completeWorldAllCorrect(page)

    await page.getByTestId('world-node-medieval').click()
    await expect(page.getByText(/Stone battlements tower/)).toBeVisible()
  })
})
