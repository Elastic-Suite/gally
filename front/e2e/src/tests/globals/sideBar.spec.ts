import {expect, test} from '@playwright/test'
import {login} from '../../utils/auth'
import {generateTestId, TestId} from "../../utils/testIds";

const testIds = {
  sideBar: generateTestId(TestId.SIDE_BAR),
  collapseButton: generateTestId(TestId.SIDE_BAR_COLLAPSING_BUTTON),
  labelMenuItemIcon: generateTestId(TestId.LABEL_MENU_ITEM_ICON),
  menuItemChildrenButton: generateTestId(TestId.MENU_ITEM_CHILDREN_COLLAPSING_BUTTON),
  menuItemChildren: generateTestId(TestId.MENU_ITEM_CHILDREN),
  labelMenuLinkItem: generateTestId(TestId.MENU_ITEM_LINK)
}

test('Globals > Layout > Side Bar', {tag: ['@premium', '@standard']}, async ({page}) => {
  await login(page)

  const sidebar = page.getByTestId(testIds.sideBar)
  const collapseButton = page.getByTestId(testIds.collapseButton)

  const labelMenuItemIconList = await page
    .getByTestId(testIds.labelMenuItemIcon)
    .all()
  const menuItemChildrenButtonList = await page
    .getByTestId(testIds.menuItemChildrenButton)
    .all()
  const menuItemChildrenList = await page.getByTestId(testIds.menuItemChildren).all()
  const labelMenuLinkItemList = await page
    .getByTestId(testIds.labelMenuLinkItem)
    .all()

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
  await page.evaluate((sideBarTestId) => {
    return new Promise<void>((resolve) => {
      const element = document.querySelector(`[data-testid="${sideBarTestId}"]`)

      element?.addEventListener('animationend', () => resolve(), {
        once: true,
      })
    })
  }, testIds.sideBar)

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
