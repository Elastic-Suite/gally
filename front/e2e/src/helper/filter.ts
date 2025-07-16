import { Locator, Page, expect } from '@playwright/test'
import { Dropdown } from './dropdown'

/**
 * Enumeration of supported filter types.
 */
export enum FilterType {
  DROPDOWN,
  BOOLEAN,
  TEXT,
  RANGE,
}

/**
 * Generic class to manage and assert filters in a UI, supporting
 * various filter types like dropdowns, booleans, text inputs, and ranges.
 */
export class Filter<TFilters extends Record<string, FilterType>> {
  private page: Page
  private filterDataTestId: string

  private filter: Locator
  private clearAllButton: Locator
  private toggleButton: Locator
  private applyButton: Locator
  private searchBar: Locator
  private filters: TFilters

  /**
   * Creates a new Filter instance.
   *
   * @param page - The Playwright Page instance
   * @param filterDataTestId - Base data-testid for filter components
   * @param filters - Mapping of filter keys to their FilterType
   */
  constructor(page: Page, filterDataTestId: string, filters: TFilters) {
    this.page = page
    this.filterDataTestId = filterDataTestId
    this.filters = filters
  }

  private getFilter(): Locator {
    if (!this.filter) {
      this.filter = this.page.getByTestId(this.filterDataTestId)
    }
    return this.filter
  }

  private getClearAllButton(): Locator {
    if (!this.clearAllButton) {
      this.clearAllButton = this.page
        .getByTestId(`${this.filterDataTestId}ClearAllButton`)
        .first()
    }
    return this.clearAllButton
  }

  private getToggleButton(): Locator {
    if (!this.toggleButton) {
      this.toggleButton = this.page.getByTestId(
        `${this.filterDataTestId}ToggleButton`
      )
    }
    return this.toggleButton
  }

  private getApplyButton(): Locator {
    if (!this.applyButton) {
      this.applyButton = this.page.getByTestId(
        `${this.filterDataTestId}ApplyButton`
      )
    }
    return this.applyButton
  }

  private getSearchBar(): Locator {
    if (!this.searchBar) {
      this.searchBar = this.page.getByTestId(
        `${this.filterDataTestId}SearchBar`
      )
    }
    return this.searchBar
  }

  /**
   * Gets the number of currently active filters.
   *
   * @returns The count of active filters
   */
  public async getActiveFiltersCount(): Promise<number> {
    const toggleButton = this.getToggleButton()
    const count = toggleButton.getByTestId(
      `${this.filterDataTestId}ActiveFiltersCount`
    )
    if (await count.isVisible()) {
      return Number.parseInt(await count.innerText())
    }
    return 0
  }

  /**
   * Clears all active filters and expects the count to reset to zero.
   */
  public async clearFilters(): Promise<void> {
    const toggleButton = this.getToggleButton()
    const clearAllButton = this.getClearAllButton()

    if (await clearAllButton.isVisible()) {
      await toggleButton.click()
    }

    await clearAllButton.click()
    await this.expectFiltersCountToBe(0)
  }

  /**
   * Fills the search input field in the filter panel.
   *
   * @param term - The search term to input
   */
  public async searchTerm(term: string): Promise<void> {
    const searchBar = this.getSearchBar()
    await searchBar.fill(term)
  }

  /**
   * Removes a specific filter chip by name and value.
   *
   * @param name - The filter name
   * @param value - The value of the filter to remove
   */
  public async removeFilter<Name extends keyof TFilters & string>(
    name: Name,
    value: TFilters[Name] extends FilterType.BOOLEAN
      ? boolean
      : TFilters[Name] extends FilterType.TEXT
      ? string
      : TFilters[Name] extends FilterType.DROPDOWN
      ? string
      : TFilters[Name] extends FilterType.RANGE
      ? [number, number]
      : never
  ): Promise<void> {
    const filter = this.getFilter()
    const toggleButton = this.getToggleButton()
    let count = await this.getActiveFiltersCount()

    const chips = filter.getByTestId(`${this.filterDataTestId}${name}Chip`)
    const chip = chips.filter({
      hasText:
        typeof value === 'boolean'
          ? value
            ? 'Yes'
            : 'No'
          : Array.isArray(value)
          ? `${value[0]}-${value[1]}`
          : value,
    })

    const chipCloseButton = chip.getByTestId('chipCloseButton')
    await chipCloseButton.click()
    count--

    const activeFiltersCount = toggleButton.getByTestId(
      `${this.filterDataTestId}ActiveFiltersCount`
    )

    if (count === 0) {
      await expect(activeFiltersCount).not.toBeAttached()
    } else {
      await expect(activeFiltersCount).toHaveText(count.toString())
    }
  }

  /**
   * Adds a new filter based on its type and value.
   *
   * @param name - The name of the filter to add
   * @param value - The value to apply (depends on filter type)
   */
  public async addFilter<Name extends keyof TFilters & string>(
    name: Name,
    value: TFilters[Name] extends FilterType.BOOLEAN
      ? boolean
      : TFilters[Name] extends FilterType.TEXT
      ? string
      : TFilters[Name] extends FilterType.DROPDOWN
      ? string[]
      : TFilters[Name] extends FilterType.RANGE
      ? [number, number]
      : never
  ): Promise<void> {
    const type = this.filters[name]
    const filter = this.getFilter()
    let count = await this.getActiveFiltersCount()
    const applyButton = this.getApplyButton()
    const toggleButton = this.getToggleButton()

    if (!(await applyButton.isVisible())) {
      await toggleButton.click()
    }

    switch (type) {
      case FilterType.DROPDOWN: {
        const multipleDropdown = new Dropdown(this.page, name, true)
        await multipleDropdown.selectValue(value as string[])
        count += (value as string[]).length
        break
      }
      case FilterType.BOOLEAN: {
        const dropdown = new Dropdown(this.page, name)
        await dropdown.selectValue((value as boolean) ? 'Yes' : 'No')
        count++
        break
      }
      case FilterType.RANGE: {
        const [firstValue, secondValue] = value as [number, number]
        const firstInputText = filter.getByTestId(`${name}First`)
        const secondInputText = filter.getByTestId(`${name}Second`)
        await firstInputText.fill(firstValue.toString())
        await secondInputText.fill(secondValue.toString())
        count++
        break
      }
      case FilterType.TEXT: {
        const inputText = filter.getByTestId(name)
        await inputText.fill(value as string)
        count++
        break
      }
    }

    await applyButton.click()

    const activeFiltersCount = toggleButton.getByTestId(
      `${this.filterDataTestId}ActiveFiltersCount`
    )
    await expect(activeFiltersCount).toHaveText(count.toString())
  }

  /**
   * Asserts that the current number of active filters equals the expected count.
   *
   * @param count - The expected number of active filters
   */
  public async expectFiltersCountToBe(count: number): Promise<void> {
    const toggleButton = this.getToggleButton()
    const spanValue = toggleButton.getByTestId(
      `${this.filterDataTestId}ActiveFiltersCount`
    )

    if (await spanValue.isVisible()) {
      await expect(spanValue).toHaveText(count.toString())
    } else {
      expect(count).toBe(0)
    }
  }
}
