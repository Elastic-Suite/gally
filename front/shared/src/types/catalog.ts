import { IGraphqlEdges } from './graphql'
import { IHydraMember } from './hydra'
import { IJsonldBase } from './jsonld'

export interface ILocalizedCatalog extends IJsonldBase {
  id: number | string
  name: string
  code: string
  locale: string
  isDefault: boolean
  localName: string
}

export interface IHydraLocalizedCatalog
  extends ILocalizedCatalog,
    IJsonldBase {}

export interface ICatalog {
  id: number | string
  code: string
  name: string
  localizedCatalogs: ILocalizedCatalog[]
}

export interface IHydraCatalog extends ICatalog, IHydraMember {}

export interface IGraphqlCatalog extends Omit<ICatalog, 'localizedCatalogs'> {
  localizedCatalogs: IGraphqlEdges<Partial<ILocalizedCatalog>>
}

export interface IGraphqlCatalogs {
  catalogs: IGraphqlEdges<Partial<IGraphqlCatalog>>
}
