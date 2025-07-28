import { Locator, Page, expect } from '@playwright/test'
import {generateTestId, TestId} from "./testIds";

/**
 * Represents a toggle switch component on a web page.
 * Provides methods to interact with and assert the state of the switch.
 */
export class Switch {
  private parent?: Locator
  private switchLocator?: Locator

  /** Playwright Page instance */
  private page: Page

  /** The data-testid value used to locate the switch */
  private switchDataTestId: string

  /**
   * Creates a new Switch instance.
   *
   * @param page - The Playwright Page object
   * @param componentId - The data-testid attribute used to locate the switch
   * @param parent - Optional parent Locator if the switch is within a container
   */
  constructor(page: Page, componentId: string, parent?: Locator) {
    this.page = page
    this.switchDataTestId = generateTestId(TestId.SWITCH, componentId)
    this.parent = parent
  }

  /**
   * Lazily retrieves the Locator for the switch using its data-testid.
   *
   * @returns The switch Locator
   */
  private getSwitch(): Locator {
    if (!this.switchLocator) {
      this.switchLocator = (this.parent || this.page).getByTestId(
        this.switchDataTestId
      )
    }
    return this.switchLocator
  }

  /**
   * Asserts whether the switch is checked (enabled) or not.
   *
   * @param checked - Expected state of the switch (default: true)
   */
  public async expectToBeChecked(checked: boolean = true): Promise<void> {
    const switchLocator = this.getSwitch()
    const checkbox = switchLocator.locator("input[type='checkbox']")

    await expect(checkbox).toBeChecked({ checked })
  }

  /**
   * Checks if the switch is currently active (checked).
   *
   * @returns A boolean indicating whether the switch is active
   */
  public async isActive(): Promise<boolean> {
    const switchLocator = this.getSwitch()
    const checkbox = switchLocator.locator("input[type='checkbox']")
    return await checkbox.isChecked()
  }

  /**
   * Enables the switch if it is not already enabled.
   * Waits for the switch to become active.
   */
  public async enable(): Promise<void> {
    const switchLocator = this.getSwitch()
    const active = await this.isActive()
    if (!active) {
      await switchLocator.click()
    }
    await this.expectToBeChecked()
  }

  /**
   * Disables the switch if it is currently enabled.
   * Waits for the switch to become inactive.
   */
  public async disable(): Promise<void> {
    const switchLocator = this.getSwitch()
    const active = await this.isActive()
    if (active) {
      await switchLocator.click()
    }
    await this.expectToBeChecked(false)
  }

  /**
   * Toggles the switch based on its current state.
   * If active, it will be disabled; if inactive, it will be enabled.
   */
  public async toggle(): Promise<void> {
    if (await this.isActive()) {
      await this.disable()
    } else {
      await this.enable()
    }
  }

  /**
   * Asserts that the switch is visible on the page.
   */
  public async expectToBeVisible(): Promise<void> {
    const switchLocator = this.getSwitch()
    await expect(switchLocator).toBeVisible()
  }
}
