import {Locator, Page, expect} from '@playwright/test'
import {Pagination} from './pagination'
import {generateTestId, TestId} from "./testIds";

interface GridCondition {
  columnName: string
  value: string
}

/**
 * Represents a grid (table) component with header and row validation,
 * and an integrated pagination system.
 */
export class Grid {
  /** Pagination instance associated with this grid */
  public pagination: Pagination
  /** Playwright Page object */
  private page: Page
  /** The data-testid used to identify the grid */
  private gridDataTestId: string
  /** Locator for the grid element */
  private grid: Locator

  /**
   * Creates a new Grid instance.
   *
   * @param page - The Playwright Page object
   * @param componentId - The component id identifying the grid container
   */
  constructor(page: Page, componentId: string) {
    this.page = page
    this.gridDataTestId = generateTestId(TestId.TABLE, componentId)
    this.pagination = new Pagination(page, componentId)
  }

  /**
   * Asserts that the grid headers match the given list.
   *
   * @param headerNames - An array of expected header titles
   */
  public async expectHeadersToBe(headerNames: string[]): Promise<void> {
    const grid = this.getGrid()

    // Wait for the header row to be attached in the DOM
    await this.page.waitForSelector(
      `[data-testId="${this.gridDataTestId}"] thead tr > th`,
      {state: 'attached'}
    )

    // Assert that the headers match the expected text
    await expect(
      await grid.locator('thead tr > th').filter({hasText: /\S/})
    ).toHaveText(headerNames, {
      useInnerText: true,
    })
  }

  /**
   * Returns the total number of rows in the grid via the pagination component.
   *
   * @returns Total row count as a number
   */
  public async getCountLines(): Promise<number> {
    return await this.pagination.getCountNumber()
  }

  /**
   * Asserts that the grid contains at least one row matching all the given conditions.
   *
   * @param conditions - An array of objects containing:
   *   - columnName: the header of the column to search in
   *   - value: the expected value in that column
   *
   * @throws Error if the column name doesn't exist
   */
  public async expectToFindLineWhere(
    conditions: GridCondition[]
  ): Promise<void> {
    const grid = await this.getGrid()

    // Ensure the first condition's column exists
    await expect(grid.locator('thead tr th')).toContainText([
      conditions[0].columnName,
    ])

    // Get all header texts
    const columnHeaders = await grid.locator('thead tr th').allInnerTexts()

    // Map column names to indices
    const columnIndices = conditions.map(({columnName}) => {
      const index = columnHeaders.findIndex(
        (header) => header.trim() === columnName
      )

      if (index === -1)
        throw new Error(
          `Column "${columnName}" not found. Available columns: [${columnHeaders.join(
            ', '
          )}]`
        )
      return index
    })

    // Find all rows in tbody
    const rows = await grid.locator(`tbody tr`)

    // Use Playwright's toPass to assert that at least one row matches all conditions
    await expect(async () => {
      const rowsCount = await rows.count()

      for (let i = 0; i < rowsCount; i++) {
        const row = rows.nth(i)
        const matchesAllConditions = await Promise.all(
          conditions.map(async ({value}, index) => {
            const cell = row.locator(
              `td:nth-child(${columnIndices[index] + 1})`
            )
            const cellText = await cell.innerText()
            return cellText.trim() === value.trim()
          })
        )
        if (matchesAllConditions.every(Boolean)) {
          return // Match found
        }
      }

      // No match found - force the assertion to fail
      throw new Error('No row matches the given conditions.')
    }).toPass({
      timeout: 5000
    })
  }

  public async expectToBeVisible(): Promise<void> {
    const grid = this.getGrid()
    await expect(grid).toBeVisible()
  }

  /**
   * Lazily retrieves the grid Locator.
   *
   * @returns The Locator for the grid
   */
  private getGrid(): Locator {
    if (!this.grid) {
      this.grid = this.page.getByTestId(this.gridDataTestId)
    }
    return this.grid
  }
}
