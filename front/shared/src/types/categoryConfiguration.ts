import { IHydraMember } from './hydra'
import { IRuleCombination } from './rules'

export interface ICategoryConfiguration extends IHydraMember {
  useNameInProductSearch: boolean
  isActive: boolean
  isVirtual: boolean
  defaultSorting: string
  name: string
  category: string
  virtualRule: string
}

export interface IParsedCategoryConfiguration
  extends Omit<ICategoryConfiguration, 'virtualRule'> {
  virtualRule: IRuleCombination
}
