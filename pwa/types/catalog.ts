import { IHydraMember } from './hydra'
import { IJsonldBase } from './jsonld'

export interface ILocalizedCatalog extends IJsonldBase {
  id: number
  name: string
  code: string
  locale: string
  isDefault: boolean
  localName: string
}

export interface ICatalog extends IHydraMember {
  code: string
  name: string
  localizedCatalogs: ILocalizedCatalog[]
}
