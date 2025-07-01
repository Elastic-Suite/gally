import { Locator, Page, expect } from '@playwright/test'
import { Dropdown } from './dropdown'

export enum FilterType {
  DROPDOWN,
  BOOLEAN,
  TEXT,
}

export class Filter<TFilters extends Record<string, FilterType>> {
  private page: Page
  private filterDataTestId: string

  private filter: Locator
  private clearAllButton: Locator
  private toggleButton: Locator
  private applyButton: Locator
  private searchBar: Locator
  private filters: TFilters

  constructor(page: Page, filterDataTestId: string, filters: TFilters) {
    this.page = page
    this.filterDataTestId = filterDataTestId
    this.filters = filters
  }

  private async getFilter(): Promise<Locator> {
    if (!this.filter) {
      this.filter = await this.page.getByTestId(this.filterDataTestId)
    }
    return this.filter
  }

  private async getClearAllButton(): Promise<Locator> {
    if (!this.clearAllButton) {
      this.clearAllButton = await this.page
        .getByTestId(`${this.filterDataTestId}ClearAllButton`)
        .first()
    }
    return this.clearAllButton
  }

  private async getToggleButton(): Promise<Locator> {
    if (!this.toggleButton) {
      this.toggleButton = await this.page.getByTestId(
        `${this.filterDataTestId}ToggleButton`
      )
    }
    return this.toggleButton
  }

  private async getApplyButton(): Promise<Locator> {
    if (!this.applyButton) {
      this.applyButton = await this.page.getByTestId(
        `${this.filterDataTestId}ApplyButton`
      )
    }
    return this.applyButton
  }

  private async getSearchBar(): Promise<Locator> {
    if (!this.searchBar) {
      this.searchBar = await this.page.getByTestId(
        `${this.filterDataTestId}SearchBar`
      )
    }
    return this.searchBar
  }

  public async getActiveFiltersCount(): Promise<number> {
    const toggleButton = await this.getToggleButton()
    const count = await toggleButton.getByTestId(
      `${this.filterDataTestId}ActiveFiltersCount`
    )
    if (await count.isVisible()) {
      return Number.parseInt(await count.innerText())
    }
    return 0
  }

  public async clearFilters(): Promise<void> {
    const toggleButton = await this.getToggleButton()

    const clearAllButton = await this.getClearAllButton()
    if (await clearAllButton.isVisible()) {
      await toggleButton.click()
    }
    await clearAllButton.click()
    await expect(toggleButton).toHaveText(`Filtrer`, {
      useInnerText: true,
    })
  }

  public async searchTerm(term: string) {
    const searchBar = await this.getSearchBar()
    await searchBar.fill(term)
  }

  public async removeFilter<Name extends keyof TFilters & string>(
    name: Name,
    value: TFilters[Name] extends FilterType.BOOLEAN
      ? boolean
      : TFilters[Name] extends FilterType.TEXT
      ? string
      : TFilters[Name] extends FilterType.DROPDOWN
      ? string
      : never
  ): Promise<void> {
    const filter = await this.getFilter()
    const toggleButton = await this.getToggleButton()
    let count = await this.getActiveFiltersCount()
    const chip = await filter
      .getByTestId(`${this.filterDataTestId}${name}Chip`)
      .filter({
        hasText: typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : value,
      })

    const chipCloseButton = await chip.getByTestId('chipCloseButton')

    await chipCloseButton.click()
    count--
    await expect(toggleButton).toHaveText(
      count === 0 ? 'Filtrer' : `Filtrer (\n${count}\n)`,
      {
        useInnerText: true,
      }
    )
  }

  public async addFilter<Name extends keyof TFilters & string>(
    name: Name,
    value: TFilters[Name] extends FilterType.BOOLEAN
      ? boolean
      : TFilters[Name] extends FilterType.TEXT
      ? string
      : TFilters[Name] extends FilterType.DROPDOWN
      ? string[]
      : never
  ): Promise<void> {
    const type = this.filters[name]
    const filter = await this.getFilter()
    let count = await this.getActiveFiltersCount()
    const applyButton = await this.getApplyButton()
    const toggleButton = await this.getToggleButton()

    if (!(await applyButton.isVisible())) {
      await toggleButton.click()
    }
    switch (type) {
      case FilterType.DROPDOWN:
        const multipleDropdown = new Dropdown(this.page, name, true)
        await multipleDropdown.selectValue(value as string[])
        count += (value as string[]).length
        break
      case FilterType.BOOLEAN:
        const dropdown = new Dropdown(this.page, name)
        await dropdown.selectValue((value as boolean) ? 'Oui' : 'Non')
        count++
        break

      case FilterType.TEXT:
        const inputText = await filter.getByTestId(name)
        await inputText.fill(value as string)
        count++
        break
    }

    await applyButton.click()
    await expect(toggleButton).toHaveText(`Filtrer (\n${count}\n)`, {
      useInnerText: true,
    })
  }

  public async expectFiltersCountToBe(count: number): Promise<void> {
    const toggleButton = await this.getToggleButton()
    const spanValue = await toggleButton.getByTestId(
      `${this.filterDataTestId}ActiveFiltersCount`
    )
    if (await spanValue.isVisible()) {
      await expect(spanValue).toHaveText(count.toString())
    } else {
      expect(count).toBe(0)
    }
  }
}
