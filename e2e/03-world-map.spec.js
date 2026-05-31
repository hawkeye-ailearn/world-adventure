import { test, expect } from '@playwright/test'
import { goto, createHero } from './helpers.js'

test.describe('World Map', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page)
    await createHero(page)
  })

  test('world map is visible after hero creation', async ({ page }) => {
    await expect(page.getByTestId('world-map-screen')).toBeVisible()
  })

  test('shows "World Map" heading', async ({ page }) => {
    await expect(page.getByText('World Map')).toBeVisible()
  })

  test('shows instruction text', async ({ page }) => {
    await expect(page.getByText('Tap a world to begin your adventure!')).toBeVisible()
  })

  test('all 5 world nodes are present', async ({ page }) => {
    for (const id of ['egypt', 'medieval', 'space', 'safari', 'india']) {
      await expect(page.getByTestId(`world-node-${id}`)).toBeVisible()
    }
  })

  test('Egypt node is unlocked (pointer cursor)', async ({ page }) => {
    const cursor = await page
      .getByTestId('world-node-egypt')
      .evaluate(el => window.getComputedStyle(el).cursor)
    expect(cursor).toBe('pointer')
  })

  test('Medieval node is locked initially (default cursor)', async ({ page }) => {
    const cursor = await page
      .getByTestId('world-node-medieval')
      .evaluate(el => window.getComputedStyle(el).cursor)
    expect(cursor).toBe('default')
  })

  test('Space node is locked initially (default cursor)', async ({ page }) => {
    const cursor = await page
      .getByTestId('world-node-space')
      .evaluate(el => window.getComputedStyle(el).cursor)
    expect(cursor).toBe('default')
  })

  test('Safari node is locked initially (default cursor)', async ({ page }) => {
    const cursor = await page
      .getByTestId('world-node-safari')
      .evaluate(el => window.getComputedStyle(el).cursor)
    expect(cursor).toBe('default')
  })

  test('India node is locked initially (default cursor)', async ({ page }) => {
    const cursor = await page
      .getByTestId('world-node-india')
      .evaluate(el => window.getComputedStyle(el).cursor)
    expect(cursor).toBe('default')
  })

  test('locked world nodes display a lock emoji', async ({ page }) => {
    for (const id of ['medieval', 'space', 'safari', 'india']) {
      await expect(page.getByTestId(`world-node-${id}`)).toContainText('🔒')
    }
  })

  test('Egypt node does not show a lock emoji', async ({ page }) => {
    const egyptText = await page.getByTestId('world-node-egypt').textContent()
    expect(egyptText).not.toContain('🔒')
  })

  test('clicking Egypt navigates to world entry screen', async ({ page }) => {
    await page.getByTestId('world-node-egypt').click()
    await expect(page.getByTestId('world-entry-screen')).toBeVisible()
  })

  test('clicking a locked world does nothing (stays on map)', async ({ page }) => {
    await page.getByTestId('world-node-medieval').click()
    await expect(page.getByTestId('world-map-screen')).toBeVisible()
  })

  test('shows world names as text labels', async ({ page }) => {
    await expect(page.getByText('Ancient Egypt')).toBeVisible()
    await expect(page.getByText('Medieval Kingdom')).toBeVisible()
    await expect(page.getByText('Outer Space')).toBeVisible()
    await expect(page.getByText('African Safari')).toBeVisible()
    await expect(page.getByText('Ancient India')).toBeVisible()
  })

  test('HeroBar is NOT shown on world map (no challenge context)', async ({ page }) => {
    // HeroBar is absent from world-map — it only appears during challenge/result/world-complete
    await expect(page.getByTestId('hero-bar')).not.toBeVisible()
  })
})

test.describe('World Map — after completing Egypt', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page)
    await createHero(page)
    // Complete Egypt with all correct answers
    await page.getByTestId('world-node-egypt').click()
    await page.getByTestId('world-entry-enter-btn').click()
    // Q1
    await page.getByTestId('mcq-option-1').click()
    await page.getByTestId('result-continue-btn').click()
    // Q2
    await page.getByTestId('numberpad-key-6').click()
    await page.getByTestId('numberpad-key-1').click()
    await page.getByTestId('numberpad-submit').click()
    await page.getByTestId('result-continue-btn').click()
    // Q3
    await page.getByTestId('mcq-option-1').click()
    await page.getByTestId('result-continue-btn').click()
    // Q4 boss
    await page.getByTestId('mcq-option-2').click()
    await page.getByTestId('result-continue-btn').click()
    // Back to map
    await page.getByTestId('world-complete-back-btn').click()
  })

  test('Egypt node shows completion checkmark', async ({ page }) => {
    await expect(page.getByTestId('world-node-egypt')).toContainText('✅')
  })

  test('Medieval becomes unlocked after Egypt completion', async ({ page }) => {
    const cursor = await page
      .getByTestId('world-node-medieval')
      .evaluate(el => window.getComputedStyle(el).cursor)
    expect(cursor).toBe('pointer')
  })

  test('Medieval no longer shows lock emoji after unlock', async ({ page }) => {
    const medievalText = await page.getByTestId('world-node-medieval').textContent()
    expect(medievalText).not.toContain('🔒')
  })

  test('Space, Safari, India still locked after only Egypt done', async ({ page }) => {
    for (const id of ['space', 'safari', 'india']) {
      const cursor = await page
        .getByTestId(`world-node-${id}`)
        .evaluate(el => window.getComputedStyle(el).cursor)
      expect(cursor).toBe('default')
    }
  })

  test('clicking Medieval enters that world', async ({ page }) => {
    await page.getByTestId('world-node-medieval').click()
    await expect(page.getByTestId('world-entry-screen')).toBeVisible()
  })
})
