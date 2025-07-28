import { Locator, Page, expect } from '@playwright/test'
import {generateTestId, TestId} from "./testIds";

/**
 * Represents a pagination component on a web page.
 * Provides methods to interact with and assert the state of pagination controls.
 */
export class Pagination {
  /** Playwright Page object */
  private page: Page

  /** The data-testid used to locate the pagination container */
  private paginationDataTestId: string

  /** Locator for the "next" button */
  private nextButton: Locator

  /** Locator for the "previous" button */
  private previousButton: Locator

  /** Locator for the pagination container */
  private pagination: Locator
  private componentId: string

  /**
   * Creates a new Pagination instance.
   *
   * @param page - The Playwright Page object
   * @param componentId - The component id used to locate the pagination element
   */
  constructor(page: Page, componentId: string) {
    this.page = page
    this.componentId = componentId
    this.paginationDataTestId = generateTestId(TestId.PAGINATION, componentId)
  }

  /**
   * Lazily gets the pagination container Locator.
   *
   * @returns Locator for the pagination element
   */
  private getPagination(): Locator {
    if (!this.pagination) {
      this.pagination = this.page.getByTestId(this.paginationDataTestId)
    }
    return this.pagination
  }

  /**
   * Lazily gets the "next page" button Locator.
   *
   * @returns Locator for the next button
   */
  private getNextButton(): Locator {
    if (!this.nextButton) {
      const pagination = this.getPagination()
      this.nextButton = pagination.locator('button').last()
    }
    return this.nextButton
  }

  /**
   * Lazily gets the "previous page" button Locator.
   *
   * @returns Locator for the previous button
   */
  private getPreviousButton(): Locator {
    if (!this.previousButton) {
      const pagination = this.getPagination()
      this.previousButton = pagination.locator('button').first()
    }
    return this.previousButton
  }

  /**
   * Retrieves the "from" number (start index of current page).
   *
   * @returns The starting item number on the current page
   */
  public async getFromNumber(): Promise<number> {
    const pagination = this.getPagination()
    const from = await pagination.getByTestId(generateTestId(TestId.PAGINATION_FROM, this.componentId)).innerText()
    return Number.parseInt(from)
  }

  /**
   * Retrieves the "to" number (end index of current page).
   *
   * @returns The ending item number on the current page
   */
  public async getToNumber(): Promise<number> {
    const pagination = this.getPagination()
    const to = await pagination.getByTestId(generateTestId(TestId.PAGINATION_TO, this.componentId)).innerText()
    return Number.parseInt(to)
  }

  /**
   * Retrieves the total count of items in the pagination.
   *
   * @returns The total number of items
   */
  public async getCountNumber(): Promise<number> {
    const pagination = this.getPagination()
    const count = await pagination.getByTestId(generateTestId(TestId.PAGINATION_COUNT, this.componentId)).innerText()
    return Number.parseInt(count)
  }

  /**
   * Retrieves the current value for "rows per page".
   *
   * @returns The number of rows currently displayed per page
   */
  public async getRowsPerPageNumber(): Promise<number> {
    const pagination = this.getPagination()
    const input = pagination.locator('input')
    return Number.parseInt(await input.inputValue())
  }

  /**
   * Changes the number of rows displayed per page using the dropdown.
   *
   * @param rowsCount - Number of rows per page (10, 25, or 50)
   */
  public async changeRowsPerPage(rowsCount: 10 | 25 | 50): Promise<void> {
    const pagination = this.getPagination()
    const input = pagination.locator('input')
    const dropdown = pagination.locator('.MuiInputBase-root')
    await dropdown.click()

    const ul = this.page.locator('#menu- .MuiList-root')
    const option = await ul
      .locator('li')
      .filter({ hasText: rowsCount.toString() })

    await option.click()
    await expect(input).toHaveValue(rowsCount.toString())
    await expect(await this.getToNumber()).toEqual(rowsCount)
  }

  /**
   * Clicks the "next page" button if it's enabled.
   *
   * @returns true if the button was clicked, false if it was disabled
   */
  public async goToNextPage(): Promise<boolean> {
    const nextButton = this.getNextButton()
    if (await nextButton.isDisabled()) {
      return false
    }
    await nextButton.click()
    return true
  }

  /**
   * Clicks the "previous page" button if it's enabled.
   *
   * @returns true if the button was clicked, false if it was disabled
   */
  public async goToPreviousPage(): Promise<boolean> {
    const previousButton = this.getPreviousButton()
    if (await previousButton.isDisabled()) {
      return false
    }
    await previousButton.click()
    return true
  }

  /**
   * Asserts that the total count is equal to the given value.
   *
   * @param value - Expected total count
   */
  public async expectToHaveCount(value: number): Promise<void> {
    const pagination = this.getPagination()
    await expect(pagination.getByTestId(generateTestId(TestId.PAGINATION_COUNT, this.componentId))).toHaveText(value.toString())
  }

  /**
   * Asserts that the total count is NOT equal to the given value.
   *
   * @param value - The count value that should NOT be present
   */
  public async expectNotToHaveCount(value: number): Promise<void> {
    const pagination = this.getPagination()
    await expect(pagination.getByTestId(generateTestId(TestId.PAGINATION_COUNT, this.componentId))).not.toHaveText(
      value.toString()
    )
  }

  /**
   * Asserts that the "rows per page" input has the expected value.
   *
   * @param value - Expected number of rows per page
   */
  public async expectToHaveRowsPerPage(value: number): Promise<void> {
    const pagination = this.getPagination()
    const input = pagination.locator('input')
    await expect(input).toHaveValue(value.toString())
  }

  /**
   * Asserts that the dropdown contains the given options.
   *
   * @param options - Array of expected options (as strings)
   */
  public async expectToHaveOptions(options: string[]): Promise<void> {
    const pagination = this.getPagination()
    const dropdown = pagination.locator('.MuiInputBase-root')
    await dropdown.click()

    const ul = this.page.locator('#menu- .MuiList-root')
    await expect(ul.locator('li')).toHaveText(options, {
      useInnerText: true,
    })

    // Close dropdown
    await this.page.locator('#menu-').click()
  }
}
