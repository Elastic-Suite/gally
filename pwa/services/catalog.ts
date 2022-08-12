import { ICatalog } from '~/types'

export function findDefaultCatalog(catalogsData: ICatalog[]): ICatalog | null {
  const defaultCatalog = catalogsData
    ? catalogsData.filter((catalog) =>
        catalog.localizedCatalogs.find((localizedCtl) => localizedCtl.isDefault)
      )[0]
    : null

  if (defaultCatalog) {
    defaultCatalog.localizedCatalogs = defaultCatalog.localizedCatalogs.filter(
      (localizedCtl) => localizedCtl.isDefault
    )
  }
  return defaultCatalog ? defaultCatalog : null
}
