import { renderWithProviders } from '~/utils/tests'
import SearchBar from './SearchBar'

describe('SearchBar match snapshot', () => {
  it('SearchBar', () => {
    const val = ''

    const { container } = renderWithProviders(
      <SearchBar nbResults={1010} value={val} />
    )
    expect(container).toMatchSnapshot()
  })
})
