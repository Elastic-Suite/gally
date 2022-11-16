import { IOptions } from './option'
import { IOperatorsValueType } from './ruleEngineOperators'
import { ITreeItem } from './tree'

export enum RuleType {
  ATTRIBUTE = 'attribute',
  COMBINATION = 'combination',
}

export enum RuleAttributeType {
  BOOLEAN = 'boolean',
  CATEGORY = 'category',
  FLOAT = 'float',
  INT = 'int',
  REFERENCE = 'reference',
  SELECT = 'select',
  TEXT = 'text',
}

export enum RuleValueType {
  BOOLEAN = 'Boolean',
  FLOAT = 'Float',
  INT = 'Int',
  STRING = 'String',
  BOOLEAN_MULTIPLE = '[Boolean]',
  FLOAT_MULTIPLE = '[Float]',
  INT_MULTIPLE = '[Int]',
  STRING_MULTIPLE = '[String]',
  STRING_REQUIRED = 'String!',
}

export enum RuleCombinationOperator {
  ALL = 'all',
  ANY = 'any',
}

export interface IRule {
  type: RuleType
  value: string | string[] | number | number[] | boolean
}

export interface IRuleAttribute extends IRule {
  type: RuleType.ATTRIBUTE
  field: string
  operator: string
  attribute_type: RuleAttributeType
}

export interface IRuleCombination extends IRule {
  type: RuleType.COMBINATION
  operator: RuleCombinationOperator
  children: IRule[]
}

export type IRuleOptions = Map<string, IOptions<unknown> | ITreeItem[]>

export interface IRuleOptionsContext {
  getAttributeOperatorOptions: (field: string) => IOptions<string>
  getAttributeType: (field: string) => RuleAttributeType
  loadAttributeValueOptions: (field: string) => void
  operatorsValueType: IOperatorsValueType
  options: IRuleOptions
}
