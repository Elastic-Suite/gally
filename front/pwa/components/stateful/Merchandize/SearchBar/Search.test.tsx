import { renderWithProviders } from '~/utils/tests'
import SearchBar from './SearchBar'

describe('SearchBar match snapshot', () => {
  it('SearchBar', () => {
    const val = ''

    const { container } = renderWithProviders(
      <SearchBar
        nbTopProducts={50}
        nbResults={1010}
        value={val}
        sortValue="category__position"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
