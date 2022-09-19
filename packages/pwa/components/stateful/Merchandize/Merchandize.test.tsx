import Merchandize from './Merchandize'
import { renderWithProviders } from '~/utils/tests'

describe('Merchandize match snapshot', () => {
  it('testSelect', () => {
    const first = true
    const sec = true
    const val = 10

    const { container } = renderWithProviders(
      <Merchandize
        virtualCategoryValue={first}
        categoryNameValue={sec}
        sortOptions={[
          { label: 'Position', value: '10' },
          { label: 'Product Name', value: '20' },
          { label: 'Price', value: '30' },
          { label: 'Performance', value: '40' },
        ]}
        sortValue={val}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
