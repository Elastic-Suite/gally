import { IHydraMember } from './hydra'

export interface IMetadata extends IHydraMember {
  entity: string
  sourceFields: string[]
}
