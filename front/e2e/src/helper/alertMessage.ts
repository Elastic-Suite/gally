import { Locator, Page, expect } from '@playwright/test'
import {generateTestId, TestId} from "./testIds";

/**
 * Helper class to interact with alert messages on the page.
 */

export enum AlertMessageType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export class AlertMessage {
  private page: Page

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
  private getLocator(type?: AlertMessageType) {
    return this.page.getByTestId(generateTestId(TestId.ALERT, type))
  }

  /**
   * Asserts that an alert message with the specified text is visible,
   * then clicks its close button (if visible) and waits for it to disappear.
   * @param message - The exact text message to expect in the alert.
   * @param type - message type ('success' | 'info' | 'warning' | 'error')
   */
  public async expectToHaveText(message: string, type?: AlertMessageType) {
    const alertMessage = this.getLocator(type).getByText(message).first()
    await expect(alertMessage).toBeVisible()

    const closeButton = alertMessage.locator('button')
    if (await closeButton.isVisible()) {
      await closeButton.click()
    }

    await expect(alertMessage).not.toBeVisible()
  }
}
