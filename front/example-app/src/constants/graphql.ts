export const catalogsQuery = `query getCalogs {
  catalogs {
    edges {
      node {
        id
        code
        name
        localizedCatalogs {
          edges {
            node {
              id
              code
              name
              locale
            }
          }
        }
      }
    }
  }
}`

export const getCategoryTreeQuery = `query getCategories($localizedCatalogId: Int) {
  getCategoryTree (localizedCatalogId: $localizedCatalogId) {
    categories
  }
}`
