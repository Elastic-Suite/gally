import { expect, Locator, Page } from '@playwright/test'
import { Dropdown } from './dropdown'
import { generateTestId, TestId } from '../utils/testIds'

/**
 * Interacts with a rule engine field (the root combination rule and its attribute conditions).
 */
export class RulesManager {
  private page: Page
  private root: Locator

  /**
   * @param page - The Playwright Page object.
   * @param componentId - The rule engine field code (e.g. "similarityRule").
   */
  constructor(page: Page, componentId: string) {
    this.page = page
    this.root = page.getByTestId(
      generateTestId(TestId.COMBINATION_RULES, componentId)
    )
  }

  public async expectToBeVisible(visible: boolean = true): Promise<void> {
    await (visible ? expect(this.root) : expect(this.root).not).toBeVisible()
  }

  /**
   * Adds an attribute condition to the root combination and selects its field.
   * @returns The index of the new condition.
   */
  public async addAttributeRule(field: string): Promise<number> {
    const index = await this.getAttributeRules().count()
    await this.root
      .getByRole('button', { name: 'Add condition' })
      .last()
      .click()
    await this.page.getByRole('menuitem', { name: 'Attribute condition' }).click()
    await expect(this.getAttributeRules()).toHaveCount(index + 1)
    await this.getFieldDropdown(index).selectValue(field)

    return index
  }

  public async removeAttributeRule(index: number): Promise<void> {
    const count = await this.getAttributeRules().count()
    await this.getAttributeRules()
      .nth(index)
      .getByTestId(generateTestId(TestId.RULE_REMOVE_BUTTON))
      .click()
    await expect(this.getAttributeRules()).toHaveCount(count - 1)
  }

  public async selectOperator(index: number, operator: string): Promise<void> {
    await this.getOperatorDropdown(index).selectValue(operator)
  }

  public async expectOperatorsToBe(
    index: number,
    operators: string[]
  ): Promise<void> {
    await this.getOperatorDropdown(index).expectToHaveOptions(operators)
  }

  public async fillValue(index: number, value: string): Promise<void> {
    await this.getValueInput(index).fill(value)
  }

  /**
   * Asserts the condition field, operator and value (null: the operator has no value input).
   */
  public async expectAttributeRuleToBe(
    index: number,
    field: string,
    operator: string,
    value: string | null
  ): Promise<void> {
    await this.getFieldDropdown(index).expectToHaveValue(field)
    await this.getOperatorDropdown(index).expectToHaveValue(operator)
    if (value === null) {
      await expect(this.getValueInput(index)).toHaveCount(0)
    } else {
      await expect(this.getValueInput(index)).toHaveValue(value)
    }
  }

  private getAttributeRules(): Locator {
    return this.root.getByTestId(generateTestId(TestId.ATTRIBUTE_RULE))
  }

  private getFieldDropdown(index: number): Dropdown {
    return new Dropdown(
      this.page,
      TestId.RULE_FIELD,
      false,
      this.getAttributeRules().nth(index)
    )
  }

  private getOperatorDropdown(index: number): Dropdown {
    return new Dropdown(
      this.page,
      TestId.RULE_OPERATOR,
      false,
      this.getAttributeRules().nth(index)
    )
  }

  private getValueInput(index: number): Locator {
    return this.getAttributeRules()
      .nth(index)
      .getByTestId(new RegExp(`\\|${TestId.RULE_VALUE}$`))
  }
}
