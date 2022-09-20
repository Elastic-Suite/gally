import {
  IRuleAttribute,
  IRuleCombination,
  RuleAttributeOperator,
  RuleAttributeType,
  RuleCombinationOperator,
  RuleType,
} from '../types'

export const emptyCombinationRule: IRuleCombination = {
  type: RuleType.COMBINATION,
  operator: RuleCombinationOperator.ALL,
  value: 'true',
  children: [],
}

export const emptyAttributeRule: IRuleAttribute = {
  type: RuleType.ATTRIBUTE,
  field: '',
  operator: '',
  attribute_type: RuleAttributeType.TEXT,
  value: '',
}

export const operatorsByType = new Map([
  [RuleAttributeType.BOOLEAN, [RuleAttributeOperator.IS]],
  [
    RuleAttributeType.CATEGORY,
    [RuleAttributeOperator.IS_ONE_OF, RuleAttributeOperator.IS_NOT_ONE_OF],
  ],
  [
    RuleAttributeType.DROPDOWN,
    [RuleAttributeOperator.IS_ONE_OF, RuleAttributeOperator.IS_NOT_ONE_OF],
  ],
  [
    RuleAttributeType.FLOAT,
    [
      RuleAttributeOperator.EQ,
      RuleAttributeOperator.NEQ,
      RuleAttributeOperator.GT,
      RuleAttributeOperator.GTE,
      RuleAttributeOperator.LT,
      RuleAttributeOperator.LTE,
    ],
  ],
  [
    RuleAttributeType.INT,
    [
      RuleAttributeOperator.EQ,
      RuleAttributeOperator.NEQ,
      RuleAttributeOperator.GT,
      RuleAttributeOperator.GTE,
      RuleAttributeOperator.LT,
      RuleAttributeOperator.LTE,
    ],
  ],
  [
    RuleAttributeType.NUMBER,
    [
      RuleAttributeOperator.EQ,
      RuleAttributeOperator.NEQ,
      RuleAttributeOperator.GT,
      RuleAttributeOperator.GTE,
      RuleAttributeOperator.LT,
      RuleAttributeOperator.LTE,
    ],
  ],
  [
    RuleAttributeType.PRICE,
    [
      RuleAttributeOperator.EQ,
      RuleAttributeOperator.NEQ,
      RuleAttributeOperator.GT,
      RuleAttributeOperator.GTE,
      RuleAttributeOperator.LT,
      RuleAttributeOperator.LTE,
    ],
  ],
  [
    RuleAttributeType.REFERENCE,
    [RuleAttributeOperator.CONTAINS, RuleAttributeOperator.DOES_NOT_CONTAINS],
  ],
  [
    RuleAttributeType.SELECT,
    [RuleAttributeOperator.IS_ONE_OF, RuleAttributeOperator.IS_NOT_ONE_OF],
  ],
  [
    RuleAttributeType.TEXT,
    [RuleAttributeOperator.CONTAINS, RuleAttributeOperator.DOES_NOT_CONTAINS],
  ],
])
