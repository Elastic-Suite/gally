import { Locator, Page, expect } from '@playwright/test'

/**
 * Helper class to interact with alert messages on the page.
 */
export class AlertMessage {
  private page: Page
  private dataTestId: string = 'alertMessage'
  private locator?: Locator

  /**
   * Creates an instance of AlertMessage.
   * @param page - The Playwright Page instance to operate on.
   */
  constructor(page: Page) {
    this.page = page
  }

  /**
   * Returns the Locator for the alert message container.
   * Caches the locator after first retrieval.
   */
  private getLocator() {
    if (!this.locator) {
      this.locator = this.page.getByTestId(this.dataTestId)
    }
    return this.locator
  }

  /**
   * Asserts that an alert message with the specified text is visible,
   * then clicks its close button (if visible) and waits for it to disappear.
   * @param message - The exact text message to expect in the alert.
   */
  public async expectToHaveText(message: string) {
    const alertMessage = this.getLocator().getByText(message).first()
    await expect(alertMessage).toBeVisible()

    const closeButton = alertMessage.locator('button')
    if (await closeButton.isVisible()) {
      await closeButton.click()
    }

    await expect(alertMessage).not.toBeVisible()
  }
}
