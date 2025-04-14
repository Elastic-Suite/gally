import { Locator, Page } from '@playwright/test'
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

  public async getHeaderColumnsName(): Promise<string[]> {
    const grid = await this.getGrid()
    const headerColumnsName = await grid.locator('thead tr th').allInnerTexts()

    return headerColumnsName
  }

  public async getCountLines(): Promise<number> {
    return await this.pagination.getCount()
  }

  public async getFirstLineWhere(
    columnName: string,
    value: string
  ): Promise<Locator | null> {
    let grid = await this.getGrid()
    const columnHeaders = await grid.locator('thead tr th').allInnerTexts()
    const columnIndex = columnHeaders.findIndex(
      (header) => header.trim() === columnName
    )

    if (columnIndex === -1) {
      throw new Error(`Column named "${columnName}" not found`)
    }

    let hasNextPage = true
    while (hasNextPage) {
      const rows = await grid.locator('tbody tr')
      for (const row of await rows.all()) {
        const cell = row.locator(`td:nth-child(${columnIndex + 1})`)
        const cellText = await cell.innerText()

        if (cellText === value) {
          return row
        }
      }
      hasNextPage = await this.pagination.goToNextPage()
    }

    return null
  }

}
