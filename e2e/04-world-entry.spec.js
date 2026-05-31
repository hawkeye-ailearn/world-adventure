import { test, expect } from '@playwright/test'
import { goto, createHero } from './helpers.js'

test.describe('World Entry Screen', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page)
    await createHero(page)
    await page.getByTestId('world-node-egypt').click()
  })

  test('world entry screen is visible', async ({ page }) => {
    await expect(page.getByTestId('world-entry-screen')).toBeVisible()
  })

  test('shows world name in header bar', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ancient Egypt' })).toBeVisible()
  })

  test('shows world emoji in header', async ({ page }) => {
    await expect(page.getByTestId('world-entry-screen')).toContainText('🏺')
  })

  test('shows the entry narrative text', async ({ page }) => {
    await expect(page.getByText(/golden sands of Ancient Egypt/)).toBeVisible()
  })

  test('shows Q1, Q2, Q3 and BOSS challenge preview labels', async ({ page }) => {
    await expect(page.getByText('Q1')).toBeVisible()
    await expect(page.getByText('Q2')).toBeVisible()
    await expect(page.getByText('Q3')).toBeVisible()
    await expect(page.getByText('BOSS')).toBeVisible()
  })

  test('Enter button is visible and contains world name', async ({ page }) => {
    const btn = page.getByTestId('world-entry-enter-btn')
    await expect(btn).toBeVisible()
    await expect(btn).toContainText('Enter Ancient Egypt')
  })

  test('clicking Enter button starts challenge screen', async ({ page }) => {
    await page.getByTestId('world-entry-enter-btn').click()
    await expect(page.getByTestId('challenge-screen')).toBeVisible()
  })

  test('world map screen is not visible while on world entry', async ({ page }) => {
    await expect(page.getByTestId('world-map-screen')).not.toBeVisible()
  })
})
