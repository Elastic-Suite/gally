import { IHydraLabelMember, IHydraMember } from './hydra'
import { IJsonldContext } from './jsonld'
export interface ISourceFieldOption extends IJsonldContext, IHydraMember {
  code: string | number
  defaultLabel: string
  sourceField: string
  position: number
  labels: IHydraLabelMember[]
}
