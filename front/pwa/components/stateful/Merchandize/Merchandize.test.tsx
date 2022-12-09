import Merchandize from './Merchandize'
import { renderWithProviders } from '~/utils/tests'

describe('Merchandize match snapshot', () => {
  it('testSelect', () => {
    const { container } = renderWithProviders(
      <Merchandize
        catConf={{
          '@id': '/category_configurations/6',
          '@type': 'CategoryConfiguration',
          id: 6,
          category: 'cat',
          defaultSorting: '10',
          isActive: true,
          isVirtual: true,
          name: 'Category',
          useNameInProductSearch: true,
        }}
        category={{
          id: 'cat_2',
          name: 'Default Category',
          level: 1,
          path: 'cat_2',
          isVirtual: false,
        }}
        sortOptions={[
          { label: 'Position', value: '10' },
          { label: 'Product Name', value: '20' },
          { label: 'Price', value: '30' },
          { label: 'Performance', value: '40' },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
