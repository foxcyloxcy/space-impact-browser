import { test, expect } from '@playwright/test'

test('starts, pauses and resumes a game', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'SPACE IMPACT' }).first()).toBeVisible()
  await page.getByRole('button', { name: 'START GAME' }).click()
  await expect(page.getByRole('button', { name: 'PAUSE' })).toBeVisible()
  await page.getByRole('button', { name: 'PAUSE' }).click()
  await expect(page.getByRole('heading', { name: 'PAUSED' })).toBeVisible()
  await page.getByRole('button', { name: 'RESUME' }).last().click()
  await expect(page.getByRole('button', { name: 'PAUSE' })).toBeVisible()
})

test('gameplay has the right responsive controls', async ({ page, isMobile }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'START GAME' }).click()
  await expect(page.getByRole('img', { name: 'Space Impact playfield' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Fire primary weapon' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Fire limited special weapon' })).toBeVisible()
  if (isMobile) {
    await page.getByRole('button', { name: 'Move up' }).tap()
    await page.getByRole('button', { name: 'Fire primary weapon' }).tap()
  } else {
    await page.keyboard.down('ArrowUp')
    await page.keyboard.down('Space')
    await page.waitForTimeout(150)
    await page.keyboard.up('Space')
    await page.keyboard.up('ArrowUp')
  }
  await expect(page.getByRole('button', { name: 'PAUSE' })).toBeVisible()
})
