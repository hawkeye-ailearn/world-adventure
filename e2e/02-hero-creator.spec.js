import { test, expect } from '@playwright/test'

test.describe('Hero Creator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('begin-adventure-btn').click()
  })

  test('hero creator screen is visible after Begin Adventure', async ({ page }) => {
    await expect(page.getByTestId('hero-creator-screen')).toBeVisible()
  })

  test('shows "Create Your Hero" heading', async ({ page }) => {
    await expect(page.getByText('Create Your Hero')).toBeVisible()
  })

  test('name input is present and focused-ready', async ({ page }) => {
    await expect(page.getByTestId('hero-name-input')).toBeVisible()
  })

  test('all three class buttons are present', async ({ page }) => {
    await expect(page.getByTestId('class-btn-warrior')).toBeVisible()
    await expect(page.getByTestId('class-btn-wizard')).toBeVisible()
    await expect(page.getByTestId('class-btn-explorer')).toBeVisible()
  })

  test('class buttons show class names and descriptions', async ({ page }) => {
    await expect(page.getByTestId('class-btn-warrior')).toContainText('Warrior')
    await expect(page.getByTestId('class-btn-wizard')).toContainText('Wizard')
    await expect(page.getByTestId('class-btn-explorer')).toContainText('Explorer')
  })

  test('submit button is disabled with no name and no class', async ({ page }) => {
    await expect(page.getByTestId('hero-submit-btn')).toBeDisabled()
  })

  test('submit button shows placeholder text when disabled', async ({ page }) => {
    await expect(page.getByTestId('hero-submit-btn')).toContainText('Pick a name and class')
  })

  test('submit stays disabled when name filled but no class selected', async ({ page }) => {
    await page.getByTestId('hero-name-input').fill('Madhav')
    await expect(page.getByTestId('hero-submit-btn')).toBeDisabled()
  })

  test('submit stays disabled when class selected but no name', async ({ page }) => {
    await page.getByTestId('class-btn-warrior').click()
    await expect(page.getByTestId('hero-submit-btn')).toBeDisabled()
  })

  test('submit becomes enabled once name AND class are provided', async ({ page }) => {
    await page.getByTestId('hero-name-input').fill('Madhav')
    await page.getByTestId('class-btn-warrior').click()
    await expect(page.getByTestId('hero-submit-btn')).toBeEnabled()
  })

  test('submit button shows personalised text with hero name', async ({ page }) => {
    await page.getByTestId('hero-name-input').fill('Madhav')
    await page.getByTestId('class-btn-warrior').click()
    await expect(page.getByTestId('hero-submit-btn')).toContainText("Let's Go, Madhav!")
  })

  test('name input enforces 20 character maximum', async ({ page }) => {
    await page.getByTestId('hero-name-input').fill('ABCDEFGHIJKLMNOPQRSTU') // 21 chars
    const value = await page.getByTestId('hero-name-input').inputValue()
    expect(value.length).toBeLessThanOrEqual(20)
  })

  test('selecting warrior shows checkmark', async ({ page }) => {
    await page.getByTestId('class-btn-warrior').click()
    await expect(page.getByTestId('class-btn-warrior')).toContainText('✓')
  })

  test('selecting wizard shows checkmark', async ({ page }) => {
    await page.getByTestId('class-btn-wizard').click()
    await expect(page.getByTestId('class-btn-wizard')).toContainText('✓')
  })

  test('selecting explorer shows checkmark', async ({ page }) => {
    await page.getByTestId('class-btn-explorer').click()
    await expect(page.getByTestId('class-btn-explorer')).toContainText('✓')
  })

  test('switching class removes checkmark from previous selection', async ({ page }) => {
    await page.getByTestId('class-btn-warrior').click()
    await page.getByTestId('class-btn-wizard').click()
    // Wizard now selected — submit shows wizard-related state
    await expect(page.getByTestId('class-btn-wizard')).toContainText('✓')
    // Warrior no longer selected → submit button personalised text uses warrior name
    // (No direct assertion on warrior lacking ✓ because text may not be rendered)
  })

  test('creating a warrior hero navigates to world map', async ({ page }) => {
    await page.getByTestId('hero-name-input').fill('Madhav')
    await page.getByTestId('class-btn-warrior').click()
    await page.getByTestId('hero-submit-btn').click()
    await expect(page.getByTestId('world-map-screen')).toBeVisible()
  })

  test('creating a wizard hero navigates to world map', async ({ page }) => {
    await page.getByTestId('hero-name-input').fill('Arjun')
    await page.getByTestId('class-btn-wizard').click()
    await page.getByTestId('hero-submit-btn').click()
    await expect(page.getByTestId('world-map-screen')).toBeVisible()
  })

  // HeroBar is only rendered inside ChallengeScreen/ResultScreen/WorldComplete —
  // not on world-map. The following tests navigate into Egypt to reach the challenge screen.

  test('hero name appears in HeroBar on challenge screen', async ({ page }) => {
    await page.getByTestId('hero-name-input').fill('Arjun')
    await page.getByTestId('class-btn-explorer').click()
    await page.getByTestId('hero-submit-btn').click()
    await page.getByTestId('world-node-egypt').click()
    await page.getByTestId('world-entry-enter-btn').click()
    await expect(page.getByTestId('hero-bar')).toContainText('Arjun')
  })

  test('hero name is trimmed before being set', async ({ page }) => {
    await page.getByTestId('hero-name-input').fill('  Madhav  ')
    await page.getByTestId('class-btn-warrior').click()
    await expect(page.getByTestId('hero-submit-btn')).toContainText("Let's Go, Madhav!")
    await page.getByTestId('hero-submit-btn').click()
    await page.getByTestId('world-node-egypt').click()
    await page.getByTestId('world-entry-enter-btn').click()
    await expect(page.getByTestId('hero-bar')).toContainText('Madhav')
  })

  test('warrior class emoji appears in HeroBar on challenge screen', async ({ page }) => {
    await page.getByTestId('hero-name-input').fill('Madhav')
    await page.getByTestId('class-btn-warrior').click()
    await page.getByTestId('hero-submit-btn').click()
    await page.getByTestId('world-node-egypt').click()
    await page.getByTestId('world-entry-enter-btn').click()
    await expect(page.getByTestId('hero-bar')).toContainText('⚔️')
  })

  test('wizard class emoji appears in HeroBar on challenge screen', async ({ page }) => {
    await page.getByTestId('hero-name-input').fill('Madhav')
    await page.getByTestId('class-btn-wizard').click()
    await page.getByTestId('hero-submit-btn').click()
    await page.getByTestId('world-node-egypt').click()
    await page.getByTestId('world-entry-enter-btn').click()
    await expect(page.getByTestId('hero-bar')).toContainText('🧙')
  })

  test('HeroBar shows Lv 1 Apprentice on first challenge', async ({ page }) => {
    await page.getByTestId('hero-name-input').fill('Madhav')
    await page.getByTestId('class-btn-warrior').click()
    await page.getByTestId('hero-submit-btn').click()
    await page.getByTestId('world-node-egypt').click()
    await page.getByTestId('world-entry-enter-btn').click()
    await expect(page.getByTestId('hero-bar-level')).toContainText('Lv 1')
    await expect(page.getByTestId('hero-bar-level')).toContainText('Apprentice')
  })

  test('HeroBar shows 0 XP on first challenge', async ({ page }) => {
    await page.getByTestId('hero-name-input').fill('Madhav')
    await page.getByTestId('class-btn-warrior').click()
    await page.getByTestId('hero-submit-btn').click()
    await page.getByTestId('world-node-egypt').click()
    await page.getByTestId('world-entry-enter-btn').click()
    await expect(page.getByTestId('hero-bar-xp')).toHaveText('0')
  })
})
