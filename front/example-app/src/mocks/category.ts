export const categoriesGraphql = {
  data: {
    getCategoryTree: {
      categories: [
        {
          id: 'one',
          name: 'Catégorie Une',
          level: 1,
          path: 'one',
          isVirtual: false,
          children: [
            {
              id: 'three',
              name: 'Catégorie Trois',
              level: 2,
              path: 'one/three',
              isVirtual: false,
            },
          ],
        },
        {
          id: 'two',
          name: 'Catégorie Deux',
          level: 1,
          path: 'two',
          isVirtual: false,
        },
      ],
    },
  },
}
