import { Locator, Page, expect } from '@playwright/test'
import { Dropdown } from './dropdown'

export enum FilterType {
  DROPDOWN,
  BOOLEAN,
}

export class Filter<withSearchBar extends boolean = false> {
  private page: Page
  private filterDataTestId: string
  private withSearchBar: boolean

  private filter: Locator
  private clearAllButton: Locator
  private filterButton: Locator
  private applyButton: Locator
  private searchBar: Locator

  constructor(
    page: Page,
    filterDataTestId?: string,
    withSearchBar?: withSearchBar
  ) {
    this.page = page
    this.filterDataTestId = filterDataTestId || 'filter'
    this.withSearchBar = (withSearchBar ?? false) as withSearchBar
  }

  private async getFilter(): Promise<Locator> {
    if (!this.filter) {
      this.filter = await this.page.getByTestId(this.filterDataTestId)
    }
    return this.filter
  }

  private async getClearAllButton(): Promise<Locator> {
    if (!this.clearAllButton) {
      const filter = await this.getFilter()
      this.clearAllButton = await filter.getByTestId('clearAllButton').first()
    }
    return this.clearAllButton
  }

  private async getFilterButton(): Promise<Locator> {
    if (!this.filterButton) {
      const filter = await this.getFilter()
      this.filterButton = await filter.getByTestId('filterButton')
    }
    return this.filterButton
  }

  private async getApplyButton(): Promise<Locator> {
    if (!this.applyButton) {
      const filter = await this.getFilter()
      this.applyButton = await filter.getByTestId('applyButton')
    }
    return this.applyButton
  }

  private async getSearchBar(): Promise<Locator> {
    if (!this.searchBar && this.withSearchBar) {
      const filter = await this.getFilter()
      this.searchBar = await filter.getByTestId('searchBar')
    }
    return this.searchBar
  }

  public async getActiveFiltersCount(): Promise<number> {
    const activeButton = await this.getFilterButton()
    const count = await activeButton.getByTestId('activeFiltersCount')
    if (await count.isVisible()) {
      return Number.parseInt(await count.innerText())
    }
    return 0
  }

  public async clearFilters(): Promise<void> {
    const filterButon = await this.getFilterButton()

    const clearAllButton = await this.getClearAllButton()
    if (await clearAllButton.isVisible()) {
      await filterButon.click()
    }
    await clearAllButton.click()
    const activeFiltersCount = await this.getActiveFiltersCount()
    await expect(activeFiltersCount).toBe(0)
  }

  public async applyFilter(): Promise<void> {
    const applyButton = await this.getApplyButton()
    if (!(await applyButton.isVisible())) {
      const filterButton = await this.getFilterButton()
      await filterButton.click()
    }
    await applyButton.click()
  }

  public async searchTerm(this: Filter<true>, term: string) {
    const searchBar = await this.getSearchBar()
    await searchBar.fill(term)
  }

  public async getFieldFilter(name: string, type?: FilterType) {
    const filter = await this.getFilter()
    const applyButton = await this.getApplyButton()
    if (!(await applyButton.isVisible())) {
      const filterButton = await this.getFilterButton()
      await filterButton.click()
    }
    switch (type) {
      case FilterType.DROPDOWN:
        return new Dropdown(this.page, name, true)
      case FilterType.BOOLEAN:
        return new Dropdown(this.page, name)
      default:
        return await filter.getByTestId(name)
    }
  }

  public async removeFilter(name: string): Promise<boolean> {
    const filter = await this.getFilter()
    const chip = await filter.getByTestId(`${name}Chip`).first()
    const chipCloseButton = await chip.getByTestId('chipCloseButton')
    await chipCloseButton.click()

    return !(await chip.isVisible())
  }
}
