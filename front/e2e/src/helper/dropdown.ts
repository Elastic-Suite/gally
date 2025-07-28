import {expect, Locator, Page} from '@playwright/test'
import {generateTestId, TestId} from "./testIds";

/**
 * A generic Dropdown class to interact with single or multi-select dropdowns in Playwright.
 * @template isMultiple - Whether the dropdown allows multiple selections.
 */
export class Dropdown<isMultiple extends boolean = false> {
  private dropdownLocator: Locator
  private dropdwonButton: Locator
  private parent?: Locator

  private page: Page
  private dropdownTestId: string
  private isMultiple: isMultiple

  /**
   * Creates a new Dropdown instance.
   * @param page - The Playwright Page object.
   * @param componentId - The base data-testid of the dropdown component.
   * @param isMultiple - Whether the dropdown allows multiple selection.
   * @param parent - Optional parent locator to scope the dropdown.
   */
  constructor(
    page: Page,
    componentId: string,
    isMultiple?: isMultiple,
    parent?: Locator
  ) {
    this.page = page
    this.dropdownTestId = generateTestId(TestId.DROPDOWN, componentId)

    this.isMultiple = (isMultiple ?? false) as isMultiple
    this.parent = parent
  }

  /**
   * Returns the dropdown container Locator.
   */
  private getDropdown(): Locator {
    if (!this.dropdownLocator) {
      this.dropdownLocator = (this.parent || this.page).getByTestId(
        this.dropdownTestId
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
        generateTestId(TestId.IONICON, generateTestId(TestId.DROPDOWN_COLLAPSING_ICON, this.dropdownTestId))
      )
    }
    return this.dropdwonButton
  }

  /**
   * Returns the list of dropdown option Locators.
   */
  private getOptions(): Locator {
    return this.page.getByTestId(
      generateTestId(TestId.DROPDOWN_OPTION, this.dropdownTestId)
    )
  }

  private getInputText(): Locator {
    return this.getDropdown().getByTestId(
      generateTestId(TestId.INPUT_TEXT, this.dropdownTestId)
    )
  }

  private getChips(): Locator {
    return this.getDropdown().getByTestId(generateTestId(
      TestId.CHIP, this.dropdownTestId
    ))
  }

  private getClearButton(): Locator {
    return this.getDropdown().getByTestId(
      generateTestId(TestId.DROPDOWN_CLEAR_ICON, this.dropdownTestId)
    )
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
    const options = this.getOptions()

    await this.open()

    if ((await options.count()) === 0)
      throw new Error(
        `No options found for dropdown: ${this.dropdownTestId}`
      )

    const firstOption = options.first()
    await firstOption.click()

    const firstOptionLabel = await firstOption.innerText()
    if (this.isMultiple) {
      const chips = this.getChips()
      await expect(chips).toHaveText(firstOptionLabel, {
        useInnerText: true,
      })
    } else {
      const inputText = this.getInputText()
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
    const options = this.getOptions()

    await this.open()

    if (Array.isArray(value)) {
      for (const label of value) {
        const selectedOption = options.getByText(label, {exact: true})
        await selectedOption.click()
      }

      const chips = this.getChips()
      await expect(chips).toHaveText(value, {
        useInnerText: true,
      })
    } else {
      const selectedOption = options.getByText(value, {exact: true})
      await selectedOption.click()

      const inputText = this.getInputText()
      await expect(inputText).toHaveValue(value)
    }

    await this.close()
  }

  /**
   * Removes the first selected value (only for multi-select).
   */
  public async removeFirstSelectedValue(this: Dropdown<true>): Promise<void> {
    const chips = this.getChips()
    const firstTag = chips.first()
    const defaultTagsCount = await chips.count()

    if (!this.isMultiple) {
      throw new Error(
        `The dropdown ${this.dropdownTestId} must be mulitple`
      )
    }

    if (defaultTagsCount === 0) {
      throw new Error(
        `No selected value found for dropdown: ${this.dropdownTestId}`
      )
    }

    const removeButtonTag = firstTag.locator('button')
    await removeButtonTag.click()

    await expect(chips).toHaveCount(defaultTagsCount - 1)
  }

  /**
   * Removes multiple selected values (only for multi-select).
   * @param values - An array of labels to remove.
   */
  public async removeSelectedValues(
    this: Dropdown<true>,
    values: string[]
  ): Promise<void> {
    const chips = this.getChips()
    const defaultTagsCount = await chips.count()

    if (!this.isMultiple)
      throw new Error(
        `The dropdown ${this.dropdownTestId} must be mulitple`
      )

    if (defaultTagsCount === 0)
      throw new Error(
        `No selected value found for dropdown: ${this.dropdownTestId}`
      )

    for (const label of values) {
      const chip = chips.getByText(label, {exact: true})
      const removeButtonTag = chip.locator('button')
      await removeButtonTag.click()
    }

    await expect(chips).toHaveCount(defaultTagsCount + values.length)
  }

  /**
   * Asserts the selected value(s) of the dropdown.
   * @param value - A string or array of selected values.
   */
  public async expectToHaveValue(
    value: isMultiple extends true ? string[] : string
  ): Promise<void> {
    if (Array.isArray(value)) {
      const chips = this.getChips()
      await expect(chips).toHaveText(value, {useInnerText: true})
    } else {
      const inputText = this.getInputText()
      await expect(inputText).toHaveValue(value)
    }
  }

  /**
   * Asserts that the dropdown displays a specific list of options.
   * @param options - List of expected dropdown option texts.
   */
  public async expectToHaveOptions(options: string[]): Promise<void> {
    await this.open()
    const optionsList = this.getOptions()

    await expect(optionsList).toHaveText(options, {useInnerText: true})
    await this.close()
  }

  /**
   * Clears all selected values in the dropdown.
   */
  public async clear() {
    const dropdown = this.getDropdown()

    if (this.isMultiple) {
      const chips = this.getChips()
      const chipsCount = await chips.count()

      if (!this.isMultiple)
        throw new Error(
          `The dropdown ${this.dropdownTestId} must be mulitple`
        )

      if (chipsCount === 0)
        throw new Error(
          `No selected value found for dropdown: ${this.dropdownTestId}`
        )

      for (let i = 0; i < chipsCount; i++) {
        const chip = chips.first()
        const removeButtonChip = chip.locator('button')
        await removeButtonChip.click()
      }

      await expect(chips).toHaveCount(0)
    } else {
      const clearButton = this.getClearButton()
      await dropdown.hover() // To display the clearButton
      await clearButton.click()
    }
  }

  /**
   * Asserts that the dropdown is visible on the page.
   */
  public async expectToBeVisible(visible?: boolean = true): Promise<void> {
    const dropdown = this.getDropdown()
    await (visible ? expect(dropdown) : expect(dropdown).not).toBeVisible()
  }
}
