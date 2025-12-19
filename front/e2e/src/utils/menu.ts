import { Page, expect } from '@playwright/test'
import {generateTestId, TestId} from "./testIds";

/**
 * Navigates to a specific page via the sidebar menu in a Playwright test.
 *
 * This function:
 * - Finds the sidebar menu using its `data-testid`.
 * - Clicks any open/expandable menu items.
 * - Clicks the target link matching the given `menuItemLabel`.
 * - Optionally asserts that the page navigated to the expected URL.
 *
 * @param page - The Playwright Page object
 * @param menuItemLabel - The visible label of the menu item to click
 * @param expectedURL - Optional URL to assert after navigation
 */
const testIds = {
  sideBar: generateTestId(TestId.SIDE_BAR),
  menuItemChildrenButton: generateTestId(TestId.MENU_ITEM_CHILDREN_COLLAPSING_BUTTON)
}

export async function navigateTo(
  page: Page,
  menuItemLabel: string,
  expectedURL?: string
) {
  // Get the sidebar container
  const sidebarMenu = page.getByTestId(testIds.sideBar)

  // Find the link inside the sidebar with the given label
  const link = sidebarMenu.getByText(menuItemLabel).first()

  // Expand any collapsible menu items before clicking
  const menuItemChildrenButtonList = await page
    .getByTestId(testIds.menuItemChildrenButton)
    .all()

  for (const locator of menuItemChildrenButtonList) {
    await locator.click()
  }

  // Click the desired link
  await link.click()

  // Assert the URL if provided
  if (expectedURL) {
    await expect(page).toHaveURL(expectedURL)
  }
}
