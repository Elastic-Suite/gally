import { IHydraMember } from './hydra'
import { IJsonldContext } from './jsonld'
import { RuleValueType } from './rules'

export type IOperatorsValueType<O extends string = string> = Record<
  string,
  Record<O, RuleValueType>
>

export interface IRuleEngineOperators<O extends string = string>
  extends IHydraMember,
    IJsonldContext {
  operators: Record<O, string>
  operatorsBySourceFieldType: Record<string, O[]>
  operatorsValueType: IOperatorsValueType
}
