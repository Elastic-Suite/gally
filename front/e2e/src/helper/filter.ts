import {expect, Locator, Page} from '@playwright/test'
import {Dropdown} from './dropdown'
import {generateTestId, TestId} from "../utils/testIds";

/**
 * Enumeration of supported filter types.
 */
export enum FilterType {
  DROPDOWN,
  BOOLEAN,
  TEXT,
  RANGE,
}

export type FilterValue<T extends FilterType> =
  T extends FilterType.BOOLEAN
    ? boolean
    : T extends FilterType.TEXT
    ? string
    : T extends FilterType.DROPDOWN
    ? string[]
    : T extends FilterType.RANGE
    ? [number, number]
    : never;

export type FilterValues<TFilters extends Record<string, FilterType>> = {
  [K in keyof TFilters]?: FilterValue<TFilters[K]>;
};

/**
 * Generic class to manage and assert filters in a UI, supporting
 * various filter types like dropdowns, booleans, text inputs, and ranges.
 */
export class Filter<TFilters extends Record<string, FilterType>> {
  private page: Page
  private testId: string

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
   * @param componentId - Base data-testid for filter components
   * @param filters - Mapping of filter keys to their FilterType
   */
  constructor(page: Page, componentId: string, filters: TFilters) {
    this.page = page
    this.testId = generateTestId(TestId.FILTER, componentId)
    this.filters = filters
  }

  private getFilter(): Locator {
    if (!this.filter) {
      this.filter = this.page.getByTestId(this.testId)
    }
    return this.filter
  }

  private getClearAllButton(): Locator {
    if (!this.clearAllButton) {
      this.clearAllButton = this.page
        .getByTestId(generateTestId(TestId.FILTER_CLEAR_BUTTON, this.testId))
        .first()
    }
    return this.clearAllButton
  }

  private getToggleButton(): Locator {
    if (!this.toggleButton) {
      this.toggleButton = this.page.getByTestId(
        generateTestId(TestId.FILTER_TOGGLE_BUTTON, this.testId)
      )
    }
    return this.toggleButton
  }

  private getApplyButton(): Locator {
    if (!this.applyButton) {
      this.applyButton = this.page.getByTestId(
        generateTestId(TestId.FILTER_APPLY_BUTTON, this.testId)
      )
    }
    return this.applyButton
  }

  private getSearchBar(): Locator {
    if (!this.searchBar) {
      const searchBarTestId = generateTestId(TestId.FILTER_SEARCH_BAR, this.testId)
      this.searchBar = this.page.getByTestId(
        generateTestId(TestId.INPUT_TEXT, searchBarTestId)
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
      generateTestId(TestId.FILTER_NB_ACTIVE_FILTERS, this.testId)
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
    const chipsBox = filter.getByTestId(generateTestId(TestId.FILTER_CHIPS_BOX, this.testId))
    const toggleButton = this.getToggleButton()
    let count = await this.getActiveFiltersCount()

    const chipDataTestId = generateTestId(TestId.CHIP, name)
    const chips = chipsBox.getByTestId(chipDataTestId)
    const chip = chips.filter({
      hasText:
        typeof value === 'boolean'
          ? value
            ? 'Yes'
            : 'No'
          : Array.isArray(value)
          ? `${value[0]} - ${value[1]}`
          : value,
    })

    const deleteIconTestId = generateTestId(TestId.CHIP_DELETE_ICON, chipDataTestId)
    const chipCloseButton = chip.getByTestId(generateTestId(TestId.IONICON,deleteIconTestId))
    await chipCloseButton.click()
    count--

    const activeFiltersCount = toggleButton.getByTestId(
      generateTestId(TestId.FILTER_NB_ACTIVE_FILTERS, this.testId)
    )

    if (count === 0) {
      await expect(activeFiltersCount).not.toBeAttached()
    } else {
      await expect(activeFiltersCount).toHaveText(count.toString())
    }
  }

  public async removeFilters(filters: Partial<{ [K in keyof TFilters]: any }>): Promise<void> {
    for (const name in filters) {
      const value = filters[name];

      // If it's an array (only for DROPDOWN), iterate.
      if (Array.isArray(value) && this.filters[name] !== FilterType.RANGE) {
        for (const item of value) {
          await this.removeFilter(name as keyof TFilters & string, item);
        }
      } else {
        await this.removeFilter(name as keyof TFilters & string, value);
      }
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
    value: FilterValue<TFilters[Name]>
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
        const firstInputText = filter.getByTestId(generateTestId(TestId.RANGE_FROM_INPUT, name))
        const secondInputText = filter.getByTestId(generateTestId(TestId.RANGE_TO_INPUT, name))
        await firstInputText.fill(firstValue.toString())
        await secondInputText.fill(secondValue.toString())
        count++
        break
      }
      case FilterType.TEXT: {
        const inputText = filter.getByTestId(generateTestId(TestId.INPUT_TEXT, name))
        await inputText.fill(value as string)
        count++
        break
      }
    }

    await applyButton.click()

    const activeFiltersCount = toggleButton.getByTestId(
      generateTestId(TestId.FILTER_NB_ACTIVE_FILTERS, this.testId)
    )
    await expect(activeFiltersCount).toHaveText(count.toString())
  }

  public async addFilters(filters: FilterValues<TFilters>): Promise<void> {
    for (const name in filters) {
      const value = filters[name];

        await this.addFilter(
          name as keyof TFilters & string,
          value as FilterValue<TFilters[keyof TFilters]>
        );
    }
  }

  /**
   * Asserts that the current number of active filters equals the expected count.
   *
   * @param count - The expected number of active filters
   */
  public async expectFiltersCountToBe(count: number): Promise<void> {
    const toggleButton = this.getToggleButton()
    const spanValue = toggleButton.getByTestId(
      generateTestId(TestId.FILTER_NB_ACTIVE_FILTERS, this.testId)
    )

    if (await spanValue.isVisible()) {
      await expect(spanValue).toHaveText(count.toString())
    } else {
      expect(count).toBe(0)
    }
  }
}
