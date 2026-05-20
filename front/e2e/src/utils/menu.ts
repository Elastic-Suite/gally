import { Page, expect } from '@playwright/test';
import { generateTestId, TestId } from "./testIds";

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
  menuItemChildrenButton: generateTestId(TestId.MENU_ITEM_CHILDREN_COLLAPSING_BUTTON),
  menuItemChildren: generateTestId(TestId.MENU_ITEM_CHILDREN)
}

export async function navigateTo(
  page: Page,
  menuItemLabel: string,
  expectedURL?: string
) {
  // Retrieve all toggle buttons for collapsible menu sections that are still collapsed
  const menuItemChildrenButtonList = page
    .getByTestId(testIds.menuItemChildrenButton)

  // Wait for the last element of the menu to be visible
  await expect(menuItemChildrenButtonList.last()).toBeVisible()

  // Retrieve all collapsible menu children containers
  const menuItemChildrenList = page
    .getByTestId(testIds.menuItemChildren)

  // Expand all collapsible menu items by clicking each toggle button 
  // if they are not already expanded
  for (const button of await menuItemChildrenButtonList.all()) {
    const isCollapsed = await button.getAttribute('data-collapsed')
    if (isCollapsed === 'true') {
      await button.click()
    }
  }

  // Wait for the last subchild to be visible
  await expect(menuItemChildrenList.last()).toBeVisible()

  // Get the sidebar container
  const sidebarMenu = page.getByTestId(testIds.sideBar)

  // Find the link inside the sidebar with the given label
  const link = sidebarMenu.getByText(menuItemLabel).first()
  // Expect the link to be visible (it should always be)
  await expect(link).toBeVisible()

  // Click the desired link
  await link.click()

  // Assert the URL if provided
  if (expectedURL) {
    await expect(page).toHaveURL(expectedURL)
  }
}
