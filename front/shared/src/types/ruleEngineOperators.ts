import { IHydraMember } from './hydra'
import { IJsonldContext } from './jsonld'

export interface IRuleEngineOperators<O extends string = string>
  extends IHydraMember,
    IJsonldContext {
  operators: Record<O, string>
  operatorsBySourceFieldType: Record<string, O[]>
  operatorsValueType: Record<string, Record<O, string>>
}
