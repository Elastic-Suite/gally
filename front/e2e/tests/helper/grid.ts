import { Locator, Page, expect } from '@playwright/test'
import { Pagination } from './pagination'

export class Grid {
  private page: Page
  private gridDataTestId: string

  private grid: Locator
  public pagination: Pagination

  constructor(page: Page, gridDataTestId: string) {
    this.page = page
    this.gridDataTestId = gridDataTestId
    this.pagination = new Pagination(page, `${gridDataTestId}Pagination`)
  }

  private async getGrid(): Promise<Locator> {
    if (!this.grid) {
      this.grid = await this.page.getByTestId(this.gridDataTestId)
    }
    return await this.grid
  }

  public async expectHeadersToEqual(headerNames: string[]): Promise<void> {
    const grid = await this.getGrid()
    const headerColumnsNameList = await grid.locator('thead tr > th')
    await expect(headerColumnsNameList).toHaveText(headerNames)
  }

  public async getCountLines(): Promise<number> {
    return await this.pagination.getCount()
  }

  public async expectToFindWhere(
    columnName: string,
    value: string
  ): Promise<void> {
    const grid = await this.getGrid()
    const columnHeaders = await grid.locator('thead tr th').allInnerTexts()
    const columnIndex = columnHeaders.findIndex(
      (header) => header.trim() === columnName
    )

    if (columnIndex === -1) {
      throw new Error(`Column named "${columnName}" not found`)
    }

    expect(
      await grid.locator(`tbody tr td:nth-child(${columnIndex + 1})`)
    ).toContainText([value])
  }
}
