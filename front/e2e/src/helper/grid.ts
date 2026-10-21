import {Locator, Page, expect} from '@playwright/test'
import {Pagination} from './pagination'
import {generateTestId, TestId} from "../utils/testIds";
import {Filter, FilterType, FilterValues} from "./filter";

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
      `[data-testid="${this.gridDataTestId}"] thead tr > th`,
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
   * Asserts that the grid headers match the given list.
   * Asserts that the pagination dropdown contains the given pagination options.
   * Asserts that the "rows per page" input has the expected value.
   *
   * @param headerNames - An array of expected header titles
   * @param paginationOptions - Array of expected pagination options (as strings)
   * @param rowsPerPage - Expected number of rows per page
   *
   */
  public async expectHeadersAndPaginationToBe(headerNames: string[], paginationOptions: string[] = ['10', '25', '50'] , rowsPerPage: number = 50): Promise<void> {
    await this.expectHeadersToBe(headerNames)
    await this.pagination.expectToHaveOptions(paginationOptions)
    await this.pagination.expectToHaveRowsPerPage(rowsPerPage)
  }

  /**
   * Assert that the expected rows are present after the filters have been applied.
   *
   * @param filter - Grid's filter
   * @param filtersToApply - Filters to apply
   * @param expectedRow - An array of objects containing:
   *   - columnName: the header of the column to search in
   *   - value: the expected value in that column
   * @param expectedRowCount - Expected row count
   */
  public async expectRowsAfterFiltersToBe<TFilters extends Record<string, FilterType>>(
    filter: Filter<TFilters>,
    filtersToApply: FilterValues<TFilters>,
    expectedRow: GridCondition[],
    expectedRowCount: number = 1,
  ) {
    await filter.addFilters(filtersToApply)
    await this.pagination.expectToHaveCount(expectedRowCount)
    if (expectedRowCount !== 0 || expectedRow.length !== 0) {
      await this.expectToFindLineWhere(expectedRow)
    }
  }

  /**
   * Assert that the expected rows are present after the search has been done.
   *
   * @param filter - Grid's filter
   * @param term - The search term to input
   * @param expectedRow - An array of objects containing:
   *   - columnName: the header of the column to search in
   *   - value: the expected value in that column
   * @param expectedRowCount - Expected row count
   */
  public async expectRowsAfterSearchToBe<TFilters extends Record<string, FilterType>>(
    filter: Filter<TFilters>,
    term: string,
    expectedRow: GridCondition[],
    expectedRowCount: number = 1,
  ) {
    await filter.searchTerm(term)
    await this.pagination.expectToHaveCount(expectedRowCount)
    if (expectedRowCount !== 0 || expectedRow.length !== 0) {
      await this.expectToFindLineWhere(expectedRow)
    }
  }

  /**
   * Assert that All filters have been removed.
   *
   * @param filter - Grid's filter
   * @param defaultRowCount - Row count without filters
   */
  public async expectAllFiltersRemoved<TFilters extends Record<string, FilterType>>(
    filter: Filter<TFilters>,
    defaultRowCount: number,
  ) {
    await filter.clearFilters()
    await this.pagination.expectToHaveCount(defaultRowCount)
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

  public static getCommonGridTestIds(
    resourceName: string,
  ) {
    return {
      createButton: generateTestId(TestId.GRID_CREATE_BUTTON, resourceName)
    } as const
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
