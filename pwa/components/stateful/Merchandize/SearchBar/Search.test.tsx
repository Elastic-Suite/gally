import SearchBar from './SearchBar'
import { renderWithProviders } from '~/services'

describe('SearchBar match snapshot', () => {
  it('SearchBar', () => {
    const args = {
      id: 'input-text',
      required: false,
      disabled: false,
      helperText: '',
      helperIcon: '',
      nbRes: 1010,
    }

    const val = ''

    const { container } = renderWithProviders(
      <SearchBar {...args} value={val} />
    )
    expect(container).toMatchSnapshot()
  })
})
