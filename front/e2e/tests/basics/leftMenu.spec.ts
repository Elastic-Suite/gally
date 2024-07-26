import { test, expect } from '@playwright/test'
import { login } from '../helper/auth'

test('Menu', async ({ page }) => {
  await login(page)

  const sidebar = await page.getByTestId('sidebarMenu')
  const collapseButton = await page.getByTestId('sidebarMenuCollapseButton')
  const labelMenuLinkItemList = await (
    await page.getByTestId('labelMenuLinkItem')
  ).all()
  const labelMenuItemIconList = await await page
    .getByTestId('labelMenuItemIcon')
    .all()
  const menuItemChildrenButtonList = await page
    .getByTestId('menuItemChildrenButton')
    .all()
  const menuItemChildrenList = await (
    await page.getByTestId('menuItemChildren')
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

  await page.waitForTimeout(500) // Wait for transition

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
