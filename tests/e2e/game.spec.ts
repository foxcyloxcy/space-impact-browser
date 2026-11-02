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

test('LCD HUD uses hard monochrome pixels with no blurred font edges', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'START GAME' }).click()
  const hudColors = await page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return []
    const data = ctx.getImageData(0, 0, 84, 7).data
    const colors = new Set<string>()
    for (let i = 0; i < data.length; i += 4) {
      colors.add(Array.from(data.slice(i, i + 4)).join(','))
    }
    return Array.from(colors).sort()
  })
  expect(hudColors).toEqual(['145,184,155,255', '23,41,30,255'])
  await expect(page.locator('canvas')).toHaveCSS('image-rendering', 'pixelated')
})
