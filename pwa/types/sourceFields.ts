import { IHydraMember } from './hydra'

export interface ISourceField extends IHydraMember {
  code: string
  defaultLabel?: string
  filterable?: boolean
  labels?: string[]
  metadata?: string
  options?: string[]
  searchable?: boolean
  sortable?: boolean
  spellchecked?: boolean
  system?: boolean
  type?: string
  usedForRules?: boolean
  weight?: number
}
