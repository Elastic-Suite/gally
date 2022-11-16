import {
  IRuleAttribute,
  IRuleCombination,
  RuleAttributeType,
  RuleCombinationOperator,
  RuleType,
  RuleValueType,
} from '../types'

export const emptyCombinationRule: IRuleCombination = {
  type: RuleType.COMBINATION,
  operator: RuleCombinationOperator.ALL,
  value: true,
  children: [],
}

export const emptyAttributeRule: IRuleAttribute = {
  type: RuleType.ATTRIBUTE,
  field: '',
  operator: '',
  attribute_type: RuleAttributeType.TEXT,
  value: '',
}

export const ruleValueNumberTypes = [RuleValueType.INT, RuleValueType.FLOAT]
export const ruleArrayValueSeparator = ','
