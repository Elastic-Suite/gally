export const catalogsGraphql = {
  data: {
    catalogs: {
      edges: [
        {
          node: {
            id: '/catalogs/1',
            code: 'com',
            name: 'COM Catalog',
            localizedCatalogs: {
              edges: [
                {
                  node: {
                    id: '/localized_catalogs/1',
                    code: 'com_fr',
                    name: 'COM French Catalog',
                  },
                },
                {
                  node: {
                    id: '/localized_catalogs/2',
                    code: 'com_en',
                    name: 'COM English Catalog',
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            id: '/catalogs/2',
            code: 'fr',
            name: 'FR Catalog',
            localizedCatalogs: {
              edges: [
                {
                  node: {
                    id: '/localized_catalogs/3',
                    code: 'fr_fr',
                    name: 'FR French Catalog',
                  },
                },
                {
                  node: {
                    id: '/localized_catalogs/4',
                    code: 'fr_en',
                    name: 'FR English Catalog',
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            id: '/catalogs/3',
            code: 'uk',
            name: 'UK Catalog',
            localizedCatalogs: {
              edges: [
                {
                  node: {
                    id: '/localized_catalogs/5',
                    code: 'en_fr',
                    name: 'EN French Catalog',
                  },
                },
                {
                  node: {
                    id: '/localized_catalogs/6',
                    code: 'en_en',
                    name: 'EN English Catalog',
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
}
