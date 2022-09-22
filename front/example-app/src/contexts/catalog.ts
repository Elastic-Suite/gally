import { createContext } from 'react'
import { ICatalog, ILocalizedCatalog } from 'shared'

interface ICatalogContext {
  catalog: ICatalog
  catalogId: string | number
  catalogs: ICatalog[]
  localizedCatalog: ILocalizedCatalog
  localizedCatalogId: string | number
  onCatalogIdChange?: (catalogId: string | number) => void
  onLocalizedCatalogIdChange?: (localizedCatalogId: string | number) => void
}

export const catalogContext = createContext<ICatalogContext>({
  catalog: null,
  catalogId: '',
  catalogs: [],
  localizedCatalog: null,
  localizedCatalogId: '',
  onCatalogIdChange: null,
  onLocalizedCatalogIdChange: null,
})
