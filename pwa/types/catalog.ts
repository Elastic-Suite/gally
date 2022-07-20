import { IHydraMember, IJsonldId, IJsonldType } from './hydra'

export interface ILocalizedCatalog extends IJsonldType, IJsonldId {
  id: number
  name: string
  code: string
  locale: string
  isDefault: boolean
  localName: string
}

export interface ICatalog extends IHydraMember {
  name: string
  localizedCatalogs: ILocalizedCatalog[]
}
