import { Locator, Page, expect } from '@playwright/test'

/**
 * A generic Dropdown class to interact with single or multi-select dropdowns in Playwright.
 * @template isMultiple - Whether the dropdown allows multiple selections.
 */
export class Dropdown<isMultiple extends boolean = false> {
  private dropdownLocator: Locator
  private dropdwonButton: Locator
  private parent?: Locator

  private page: Page
  private dropdownDataTestId: string
  private isMultiple: isMultiple

  /**
   * Creates a new Dropdown instance.
   * @param page - The Playwright Page object.
   * @param dropdownDataTestId - The base data-testid of the dropdown component.
   * @param isMultiple - Whether the dropdown allows multiple selection.
   * @param parent - Optional parent locator to scope the dropdown.
   */
  constructor(
    page: Page,
    dropdownDataTestId: string,
    isMultiple?: isMultiple,
    parent?: Locator
  ) {
    this.page = page
    this.dropdownDataTestId = dropdownDataTestId
    this.isMultiple = (isMultiple ?? false) as isMultiple
    this.parent = parent
  }

  /**
   * Returns the dropdown container Locator.
   */
  private getDropdown(): Locator {
    if (!this.dropdownLocator) {
      this.dropdownLocator = (this.parent || this.page).getByTestId(
        this.dropdownDataTestId
      )
    }
    return this.dropdownLocator
  }

  /**
   * Returns the dropdown toggle button Locator.
   */
  private getButton(): Locator {
    if (!this.dropdwonButton) {
      const dropdown = this.getDropdown()
      this.dropdwonButton = dropdown.getByTestId(
        `${this.dropdownDataTestId}Button`
      )
    }
    return this.dropdwonButton
  }

  /**
   * Returns the list of dropdown option Locators.
   */
  private getOptions(): Locator {
    return this.page.getByTestId(`${this.dropdownDataTestId}DropdownOption`)
  }

  /**
   * Checks if the dropdown is currently open.
   */
  private async isOpen(): Promise<boolean> {
    const option = this.getOptions().first()
    return await option.isVisible()
  }

  /**
   * Opens the dropdown (if not already open).
   */
  private async open(): Promise<void> {
    const option = this.getOptions().first()
    const button = this.getButton()
    if (!(await this.isOpen())) {
      await button.click()
    }
    await expect(option).toBeVisible()
  }

  /**
   * Closes the dropdown (if open).
   */
  private async close(): Promise<void> {
    const option = this.getOptions().first()
    const button = this.getButton()
    if (await this.isOpen()) {
      await button.click()
    }
    await expect(option).not.toBeVisible()
  }

  /**
   * Selects the first available option in the dropdown.
   */
  public async selectFirstValue(): Promise<void> {
    const dropdown = this.getDropdown()
    const options = this.getOptions()

    await this.open()

    if ((await options.count()) === 0)
      throw new Error(
        `No options found for dropdown: ${this.dropdownDataTestId}`
      )

    const firstOption = options.first()
    await firstOption.click()

    const firstOptionLabel = await firstOption.innerText()
    if (this.isMultiple) {
      const tag = await dropdown.getByTestId(`${this.dropdownDataTestId}Tag`)
      await expect(await tag).toHaveText(firstOptionLabel, {
        useInnerText: true,
      })
    } else {
      const inputText = dropdown.getByTestId(
        `${this.dropdownDataTestId}InputText`
      )
      await expect(inputText).toHaveValue(firstOptionLabel)
    }

    await this.close()
  }

  /**
   * Selects one or more values in the dropdown.
   * @param value - A string (for single) or array of strings (for multi).
   */
  public async selectValue(
    value: isMultiple extends true ? string[] : string
  ): Promise<void> {
    const dropdown = this.getDropdown()
    const options = this.getOptions()

    await this.open()

    if (Array.isArray(value)) {
      for (const label of value) {
        const selectedOption = options.getByText(label, { exact: true })
        await selectedOption.click()
      }

      const tags = dropdown.getByTestId(`${this.dropdownDataTestId}Tag`)
      await expect(tags).toHaveText(value, {
        useInnerText: true,
      })
    } else {
      const selectedOption = options.getByText(value, { exact: true })
      await selectedOption.click()

      const inputText = dropdown.getByTestId(
        `${this.dropdownDataTestId}InputText`
      )
      await expect(inputText).toHaveValue(value)
    }

    await this.close()
  }

  /**
   * Removes the first selected value (only for multi-select).
   */
  public async removeFirstSelectedValue(this: Dropdown<true>): Promise<void> {
    const dropdown = this.getDropdown()
    const tags = dropdown.getByTestId(`${this.dropdownDataTestId}Tag`)
    const firstTag = tags.first()
    const defaultTagsCount = await tags.count()

    if (!this.isMultiple) {
      throw new Error(
        `The dropdown ${this.dropdownDataTestId} must be mulitple`
      )
    }

    if (defaultTagsCount === 0) {
      throw new Error(
        `No selected value found for dropdown: ${this.dropdownDataTestId}`
      )
    }

    const removeButtonTag = firstTag.locator('button')
    await removeButtonTag.click()

    await expect(tags).toHaveCount(defaultTagsCount - 1)
  }

  /**
   * Removes multiple selected values (only for multi-select).
   * @param values - An array of labels to remove.
   */
  public async removeSelectedValues(
    this: Dropdown<true>,
    values: string[]
  ): Promise<void> {
    const dropdown = this.getDropdown()
    const tags = dropdown.getByTestId(`${this.dropdownDataTestId}Tag`)
    const defaultTagsCount = await tags.count()

    if (!this.isMultiple)
      throw new Error(
        `The dropdown ${this.dropdownDataTestId} must be mulitple`
      )

    if (defaultTagsCount === 0)
      throw new Error(
        `No selected value found for dropdown: ${this.dropdownDataTestId}`
      )

    for (const label of values) {
      const tag = tags.getByText(label, { exact: true })
      const removeButtonTag = tag.locator('button')
      await removeButtonTag.click()
    }

    await expect(tags).toHaveCount(defaultTagsCount + values.length)
  }

  /**
   * Asserts the selected value(s) of the dropdown.
   * @param value - A string or array of selected values.
   */
  public async expectToHaveValue(
    value: isMultiple extends true ? string[] : string
  ): Promise<void> {
    const dropdown = this.getDropdown()
    if (Array.isArray(value)) {
      const tags = dropdown.getByTestId(`${this.dropdownDataTestId}Tag`)
      await expect(tags).toHaveText(value, { useInnerText: true })
    } else {
      const inputText = dropdown.getByTestId(
        `${this.dropdownDataTestId}InputText`
      )
      await expect(inputText).toHaveValue(value)
    }
  }

  /**
   * Asserts that the dropdown displays a specific list of options.
   * @param options - List of expected dropdown option texts.
   */
  public async expectToHaveOptions(options: string[]): Promise<void> {
    await this.open()
    const optionsList = this.page.getByTestId(
      `${this.dropdownDataTestId}DropdownOption`
    )

    await expect(optionsList).toHaveText(options, { useInnerText: true })
    await this.close()
  }

  /**
   * Clears all selected values in the dropdown.
   */
  public async clear() {
    const dropdown = this.getDropdown()

    if (this.isMultiple) {
      const tags = dropdown.getByTestId(`${this.dropdownDataTestId}Tag`)
      const tagsCount = await tags.count()

      if (!this.isMultiple)
        throw new Error(
          `The dropdown ${this.dropdownDataTestId} must be mulitple`
        )

      if (tagsCount === 0)
        throw new Error(
          `No selected value found for dropdown: ${this.dropdownDataTestId}`
        )

      for (let i = 0; i < tagsCount; i++) {
        const tag = tags.first()
        const removeButtonTag = tag.locator('button')
        await removeButtonTag.click()
      }

      await expect(tags).toHaveCount(0)
    } else {
      const clearButton = this.page.getByTestId(
        `${this.dropdownDataTestId}ClearButton`
      )
      await dropdown.hover() // To display the clearButton
      await clearButton.click()
    }
  }

  /**
   * Asserts that the dropdown is visible on the page.
   */
  public async expectToBeVisible(): Promise<void> {
    const dropdown = this.getDropdown()
    await expect(dropdown).toBeVisible()
  }
}
