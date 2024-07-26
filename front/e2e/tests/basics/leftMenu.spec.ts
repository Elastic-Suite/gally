import { test, expect } from '@playwright/test'
import { login } from '../helper/auth'

test('Menu', async ({ page }) => {
  await login(page)

  const sidebar = await page.getByTestId('sidebarMenu')
  const collapseButton = await page.getByTestId('sidebarMenuCollapseButton')
  const labelMenuItemIconList = await await page
    .getByTestId('labelMenuItemIcon')
    .all()
  const menuItemChildrenButtonList = await page
    .getByTestId('menuItemChildrenButton')
    .all()
  const menuItemChildrenList = await (
    await page.getByTestId('menuItemChildren')
  ).all()
  const labelMenuLinkItemList = await (
    await page.getByTestId('labelMenuLinkItem')
  ).all()
  for (const locator of menuItemChildrenList) {
    await expect(locator).not.toBeVisible()
  }

  for (const locator of menuItemChildrenButtonList) {
    await locator.click()
  }

  for (const locator of [...labelMenuLinkItemList, ...labelMenuItemIconList]) {
    await expect(locator).toBeVisible()
  }

  const defaultSideBarWidth = (await sidebar.boundingBox())?.width

  await expect(defaultSideBarWidth).not.toBe(undefined)

  await collapseButton.click()

  // Wait for menu transition to end
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      const element = document.querySelector('[data-testid="sidebarMenu"]')

      element?.addEventListener('animationend', () => resolve(), {
        once: true,
      })
    })
  })

  await expect((await sidebar.boundingBox())?.width).toBeLessThan(
    defaultSideBarWidth as number
  )

  for (const locator of [...labelMenuLinkItemList, ...labelMenuItemIconList]) {
    await expect(locator).not.toBeVisible()
  }

  await collapseButton.click()

  await expect((await sidebar.boundingBox())?.width).toBe(defaultSideBarWidth)

  for (const locator of [...labelMenuLinkItemList, ...labelMenuItemIconList]) {
    await expect(locator).toBeVisible()
  }

  for (const locator of menuItemChildrenButtonList) {
    await locator.click()
  }

  for (const locator of menuItemChildrenList) {
    await expect(locator).not.toBeVisible()
  }
})
