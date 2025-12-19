import {expect, Locator, Page} from "@playwright/test";
import {generateTestId, TestId} from "../utils/testIds";

/**
 * Utility class to interact with a Tabs component in Playwright tests.
 */
export class Tabs {
  private page: Page
  private readonly tabsTestId: string
  private readonly tabTestId: string

  /**
   * Creates a new instance of the Tabs class.
   * @param page - The Playwright Page object.
   * @param componentId - Optional identifier to distinguish multiple instances of the Tabs component.
   */
  constructor(page: Page, componentId?: string) {
    this.page = page
    this.tabsTestId = generateTestId(TestId.TABS, componentId)
    this.tabTestId = generateTestId(TestId.TAB, componentId)
  }

  /**
   * Retrieves the locator for the tabs container using its data-testid.
   * @returns A Locator for the tabs container element.
   */
  private getTabsContainer(): Locator {
    return this.page.getByTestId(this.tabsTestId)
  }

  /**
   * Retrieves a specific tab element based on its visible label.
   * @param tabLabel - The visible text of the tab to locate.
   * @returns A Locator for the tab matching the given label.
   */
  private getTabByLabel(tabLabel: string): Locator {
    const container = this.getTabsContainer()
    return container.getByTestId(this.tabTestId).filter({hasText: tabLabel})
  }

  /**
   * Navigates to a specific tab by clicking on it.
   * Ensures the tab is visible before interacting.
   * Optionally verifies the expected URL after the click.
   * @param tabLabel - The label of the tab to navigate to.
   * @param expectedUrl - (Optional) The expected URL after navigation.
   */
  public async navigateTo(tabLabel: string, expectedUrl?: string): Promise<void> {
    const tab = this.getTabByLabel(tabLabel)
    await expect(tab).toBeVisible()
    await tab.click()
    if (expectedUrl) {
      await expect(this.page).toHaveURL(expectedUrl)
    }
  }

  /**
   * Asserts that the currently displayed tabs match the provided list of labels.
   * @param tabs - An array of expected tab labels.
   */
  public async expectToHaveTabs(tabs: string[]): Promise<void> {
    const container = this.getTabsContainer()
    const tabsLocator = container.getByTestId(this.tabTestId)
    await expect(tabsLocator).toHaveText(tabs, {
      useInnerText: true,
    })
  }

  public async expectToHaveSomeTabs(tabs: string[]): Promise<void> {
    const container = this.getTabsContainer()
    const tabsLocator = container.getByTestId(this.tabTestId)
    await expect(tabsLocator).toContainText(tabs, {
      useInnerText: true,
    })
  }
}
