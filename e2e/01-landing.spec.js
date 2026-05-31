import { test, expect } from '@playwright/test'

test.describe('Landing Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('landing screen is visible on load', async ({ page }) => {
    await expect(page.getByTestId('landing-screen')).toBeVisible()
  })

  test('shows WORLD QUEST title (two lines)', async ({ page }) => {
    await expect(page.getByText('WORLD', { exact: true })).toBeVisible()
    await expect(page.getByText('QUEST', { exact: true })).toBeVisible()
  })

  test('shows subtitle', async ({ page }) => {
    await expect(page.getByText('An Adventure Through Time & Space')).toBeVisible()
  })

  test('shows all 5 world emoji in the emoji row', async ({ page }) => {
    // The emoji row uses spans; check each world emoji is present somewhere on screen
    const content = await page.getByTestId('landing-screen').textContent()
    expect(content).toContain('🏺')
    expect(content).toContain('🏰')
    expect(content).toContain('🚀')
    expect(content).toContain('🦁')
    expect(content).toContain('🪔')
  })

  test('Begin Adventure button is visible and enabled', async ({ page }) => {
    const btn = page.getByTestId('begin-adventure-btn')
    await expect(btn).toBeVisible()
    await expect(btn).toBeEnabled()
    await expect(btn).toContainText('Begin Adventure')
  })

  test('shows tagline', async ({ page }) => {
    await expect(page.getByText('5 worlds · history · maths · science')).toBeVisible()
  })

  test('clicking Begin Adventure navigates to hero creator', async ({ page }) => {
    await page.getByTestId('begin-adventure-btn').click()
    await expect(page.getByTestId('hero-creator-screen')).toBeVisible()
    await expect(page.getByTestId('landing-screen')).not.toBeVisible()
  })
})
