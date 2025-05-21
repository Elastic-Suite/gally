import { Locator, Page, expect } from '@playwright/test'

export class Pagination {
  private page: Page
  private paginationDataTestId: string

  private nextButton: Locator
  private previousButton: Locator
  private pagination: Locator

  constructor(page: Page, paginationDataTestId: string) {
    this.page = page
    this.paginationDataTestId = paginationDataTestId
  }

  private async getPagination(): Promise<Locator> {
    if (!this.pagination) {
      this.pagination = await this.page.getByTestId(this.paginationDataTestId)
    }
    return this.pagination
  }

  private async getNextButton(): Promise<Locator> {
    if (!this.nextButton) {
      const pagination = await this.getPagination()
      this.nextButton = await pagination.locator('button').last()
    }
    return this.nextButton
  }

  private async getPreviousButton(): Promise<Locator> {
    if (!this.previousButton) {
      const pagination = await this.getPagination()
      this.previousButton = await pagination.locator('button').first()
    }
    return this.previousButton
  }

  public async getFrom(): Promise<number> {
    const pagination = await this.getPagination()
    const from = await (await pagination.getByTestId('from')).innerText()
    return Number.parseInt(from)
  }

  public async getTo(): Promise<number> {
    const pagination = await this.getPagination()
    const to = await (await pagination.getByTestId('to')).innerText()
    return Number.parseInt(to)
  }

  public async getCount(): Promise<number> {
    const pagination = await this.getPagination()
    const count = await (await pagination.getByTestId('count')).innerText()
    return Number.parseInt(count)
  }

  public async getRowsPerPage(): Promise<number> {
    const pagination = await this.getPagination()
    const input = await pagination.locator('input')

    return Number.parseInt(await input.inputValue())
  }

  public async changeRowsPerPage(rowsCount: 10 | 25 | 50): Promise<void> {
    const pagination = await this.getPagination()
    const input = await pagination.locator('input')
    const dropdown = await pagination.locator('.MuiInputBase-root')
    await dropdown.click()

    const ul = await this.page.locator('#menu- .MuiList-root')
    const option = await ul
      .locator('li')
      .filter({ hasText: rowsCount.toString() })

    await option.click()
    await expect(input).toHaveValue(rowsCount.toString())
    await expect(await this.getTo()).toEqual(rowsCount)
  }

  public async goToNextPage(): Promise<boolean> {
    const nextButton = await this.getNextButton()
    if (await nextButton.isDisabled()) {
      return false
    }
    await nextButton.click()
    return true
  }

  public async goToPreviousPage(): Promise<boolean> {
    const previousButton = await this.getPreviousButton()
    if (await previousButton.isDisabled()) {
      return false
    }
    await previousButton.click()
    return true
  }

  public async expectCountToBe(value: number): Promise<void> {
    const pagination = await this.getPagination()
    await expect(await pagination.getByTestId('count')).toHaveText(
      value.toString()
    )
  }

  public async expectCountToBeDifferentFrom(value: number): Promise<void> {
    const pagination = await this.getPagination()
    await expect(await pagination.getByTestId('count')).not.toHaveText(
      value.toString()
    )
  }

  public async expectRowsPerPageToBe(value: number): Promise<void> {
    const pagination = await this.getPagination()
    const input = await pagination.locator('input')
    await expect(input).toHaveValue(value.toString())
  }

  public async expectOptionsToBe(options: string[]): Promise<void> {
    const pagination = await this.getPagination()
    const dropdown = await pagination.locator('.MuiInputBase-root')
    await dropdown.click()

    const ul = await this.page.locator('#menu- .MuiList-root')
    await expect(await ul.locator('li')).toHaveText(options, {
      useInnerText: true,
    })
    await (await this.page.locator('#menu-')).click()
  }
}
