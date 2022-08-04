import Tree from './Tree'
import { renderWithProviders } from '~/services'
import categories from '../../../public/mocks/categories.json'

describe('Tree match snapshot', () => {
  it('Tree simple', () => {
    const { container } = renderWithProviders(
      <Tree data={categories.data.categoryTrees} />
    )
    expect(container).toMatchSnapshot()
  })

  it('Tree data CatalogName', () => {
    const { container } = renderWithProviders(
      <Tree
        data={categories.data.categoryTrees}
        selectedItem={{
          catalogCode: 'com_fr',
          catalogName: 'Cat One',
          categories: [
            {
              id: 'com_fr_1',
              name: 'Cat One One',
              level: 1,
              path: '1',
              isVirtual: false,
            },
            {
              id: 'com_fr_2',
              name: 'Cat One Two',
              level: 1,
              path: '2',
              isVirtual: false,
              children: [
                {
                  id: 'com_fr_2_1',
                  name: 'Cat One Two One',
                  level: 2,
                  path: '1/3',
                  isVirtual: false,
                  children: [
                    {
                      id: 'com_fr_2_1_1',
                      name: 'Cat One Two One One',
                      level: 2,
                      path: '1/3',
                      isVirtual: false,
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
