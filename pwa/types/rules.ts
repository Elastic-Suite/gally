export enum RuleType {
  ATTRIBUTE = 'attribute',
  CONDITION = 'condition',
  COMBINATION = 'combination',
}

export enum RuleAttributeOperator {
  IS_ONE_OF = 'is_one_of',
  IS_NOT_ONE_OF = 'is_not_one_of',
  GTE = 'gte',
  LTE = 'lte',
  EQ = 'eq',
  NEQ = 'neq',
  IS = 'is',
}

export enum RuleAttributeType {
  SELECT = 'select',
  FLOAT = 'float',
}

export enum RuleCombinationOperator {
  ALL = 'all',
  ANY = 'any',
}

export interface IRule {
  type: RuleType
  value: string
}

export interface IRuleAttribute extends IRule {
  type: RuleType.ATTRIBUTE
  field: string
  operator: RuleAttributeOperator
  attribute_type: RuleAttributeType
}

export interface IRuleCondition extends IRule {
  type: RuleType.CONDITION
}

export interface IRuleCombination extends IRule {
  type: RuleType.COMBINATION
  operator: RuleCombinationOperator
  children: IRule[]
}
