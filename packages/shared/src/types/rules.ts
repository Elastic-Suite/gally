import { IOptions } from './option'
import { ITreeItem } from './tree'

export enum RuleType {
  ATTRIBUTE = 'attribute',
  COMBINATION = 'combination',
}

export enum RuleAttributeOperator {
  CONTAINS = 'contains',
  DOES_NOT_CONTAINS = 'does_not_contains',
  IS_ONE_OF = 'is_one_of',
  IS_NOT_ONE_OF = 'is_not_one_of',
  GTE = 'gte',
  LTE = 'lte',
  GT = 'gt',
  LT = 'lt',
  EQ = 'eq',
  NEQ = 'neq',
  IS = 'is',
  IS_NOT = 'is_not',
}

export enum RuleAttributeType {
  BOOLEAN = 'boolean',
  CATEGORY = 'category',
  DROPDOWN = 'dropdown',
  FLOAT = 'float',
  INT = 'int',
  NUMBER = 'number',
  PRICE = 'price',
  REFERENCE = 'reference',
  SELECT = 'select',
  TEXT = 'text',
}

export enum RuleCombinationOperator {
  ALL = 'all',
  ANY = 'any',
}

export interface IRule {
  type: RuleType
  value: string | string[]
}

export interface IRuleAttribute extends IRule {
  type: RuleType.ATTRIBUTE
  field: string
  operator: RuleAttributeOperator | ''
  attribute_type: RuleAttributeType
}

export interface IRuleCombination extends IRule {
  type: RuleType.COMBINATION
  operator: RuleCombinationOperator
  children: IRule[]
}

export type IRuleOptions = Map<string, IOptions<unknown> | ITreeItem[]>

export interface IRuleOptionsContext {
  options: IRuleOptions
  getAttributeOperatorOptions: (field: string) => IOptions<string>
  getAttributeType: (field: string) => RuleAttributeType
  loadAttributeValueOptions: (field: string) => void
}
