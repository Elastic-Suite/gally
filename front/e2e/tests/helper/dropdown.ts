import { Locator, Page, expect } from '@playwright/test'
import { findAsync } from './global'

export class Dropdown<isMultiple extends boolean = false> {
  private dropdownLocator: Locator
  private dropdwonButton: Locator

  private page: Page
  private dropdownDataTestId: string
  private isMultiple: isMultiple

  constructor(page: Page, dropdownDataTestId: string, isMultiple?: isMultiple) {
    this.page = page
    this.dropdownDataTestId = dropdownDataTestId
    this.isMultiple = (isMultiple ?? false) as isMultiple
  }

  public async getDropdown() {
    if (!this.dropdownLocator) {
      this.dropdownLocator = await this.page.getByTestId(
        this.dropdownDataTestId
      )
    }
    return this.dropdownLocator
  }

  public async getButton() {
    if (!this.dropdwonButton) {
      const dropdown = await this.getDropdown()
      this.dropdwonButton = dropdown.getByTestId(
        `${this.dropdownDataTestId}Button`
      )
    }
    return this.dropdwonButton
  }

  private async getOptions() {
    return await this.page
      .getByTestId(`${this.dropdownDataTestId}DropdownOption`)
      .all()
  }

  public async selectFirstValue() {
    const button = await this.getButton()
    await button.click()

    const options = await this.getOptions()
    if (options.length === 0)
      throw new Error(
        `No options found for dropdown: ${this.dropdownDataTestId}`
      )

    const firstOptionLabel = await options[0].innerText()
    await options[0].click()

    const dropdown = await this.getDropdown()
    if (this.isMultiple) {
      const tag = await dropdown.getByTestId(`${this.dropdownDataTestId}Tag`)
      await expect(await tag.innerText()).toBe(firstOptionLabel)
    } else {
      const inputText = await dropdown.getByTestId(
        `${this.dropdownDataTestId}InputText`
      )
      await expect(inputText).toHaveValue(firstOptionLabel)
    }
  }

  public async selectValue(value: isMultiple extends true ? string[] : string) {
    const button = await this.getButton()
    await button.click()

    const options = await this.getOptions()
    if (options.length === 0)
      throw new Error(
        `No options found for dropdown: ${this.dropdownDataTestId}`
      )

    if (Array.isArray(value)) {
      for (const label of value) {
        const selectedOption = await findAsync(
          options,
          async (option) => (await option.innerText()) === label
        )

        if (!selectedOption)
          throw new Error(
            `Option '${label}' not found in dropdown: ${this.dropdownDataTestId}`
          )
        await selectedOption.click()
      }

      const dropdown = await this.getDropdown()
      const tags = await dropdown
        .getByTestId(`${this.dropdownDataTestId}Tag`)
        .all()
      const tagTexts = await Promise.all(tags.map((tag) => tag.innerText()))
      expect(tagTexts).toEqual(value)
    } else {
      const selectedOption = await findAsync(
        options,
        async (option) => (await option.innerText()) === value
      )
      if (!selectedOption)
        throw new Error(
          `Option '${value}' not found in dropdown: ${this.dropdownDataTestId}`
        )
      await selectedOption.click()

      const inputText = await (
        await this.getDropdown()
      ).getByTestId(`${this.dropdownDataTestId}InputText`)
      await expect(inputText).toHaveValue(value)
    }
  }

  public async removeFirstSelectedValue(this: Dropdown<true>) {
    if (!this.isMultiple) {
      throw new Error(
        `The dropdown ${this.dropdownDataTestId} must be mulitple`
      )
    }
    const dropdown = await this.getDropdown()
    const tags = await dropdown
      .getByTestId(`${this.dropdownDataTestId}Tag`)
      .all()
    if (tags.length === 0) {
      throw new Error(
        `No selected value found for dropdown: ${this.dropdownDataTestId}`
      )
    }
    const removeButtonTag = await tags[0].locator('button')
    await removeButtonTag.click()

    const newTags = await dropdown
      .getByTestId(`${this.dropdownDataTestId}Tag`)
      .all()
    expect(tags.length).toBe(newTags.length + 1)
  }

  public async removeSelectedValues(this: Dropdown<true>, values: string[]) {
    if (!this.isMultiple)
      throw new Error(
        `The dropdown ${this.dropdownDataTestId} must be mulitple`
      )
    const dropdown = await this.getDropdown()
    const tags = await dropdown
      .getByTestId(`${this.dropdownDataTestId}Tag`)
      .all()
    if (tags.length === 0)
      throw new Error(
        `No selected value found for dropdown: ${this.dropdownDataTestId}`
      )

    for (const label of values) {
      const tag = await findAsync(
        tags,
        async (tag) => (await tag.innerText()) === label
      )
      if (!tag)
        throw new Error(
          `Selected value '${label}' not found in dropdown: ${this.dropdownDataTestId}`
        )
      const removeButtonTag = await tag.locator('button')
      await removeButtonTag.click()
    }

    const newTags = await dropdown
      .getByTestId(`${this.dropdownDataTestId}Tag`)
      .all()
    expect(tags.length).toBe(newTags.length + values.length)
  }
}
