import { IHydraMember } from './hydra'
import { IJsonldContext } from './jsonld'

export interface ISourceFieldOption extends IJsonldContext, IHydraMember {
  code: string | number
  sourceField: string
  position: number
  labels: string[]
}
