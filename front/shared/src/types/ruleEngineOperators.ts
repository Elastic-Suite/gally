import { IHydraMember } from './hydra'
import { IJsonldContext } from './jsonld'

export type IOperatorsValueType<O extends string = string> = Record<
  string,
  Record<O, string>
>

export interface IRuleEngineOperators<O extends string = string>
  extends IHydraMember,
    IJsonldContext {
  operators: Record<O, string>
  operatorsBySourceFieldType: Record<string, O[]>
  operatorsValueType: IOperatorsValueType
}
