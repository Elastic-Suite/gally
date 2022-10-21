import { IOptions } from './option'
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
  options: IRuleOptions
  getAttributeOperatorOptions: (field: string) => IOptions<string>
  getAttributeType: (field: string) => RuleAttributeType
  loadAttributeValueOptions: (field: string) => void
}
