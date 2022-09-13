import { IHydraLabelMember } from './hydra'

export interface ISourceFieldOption extends IHydraLabelMember {
  position: number
  labels: string[]
  sourceField: string
}
