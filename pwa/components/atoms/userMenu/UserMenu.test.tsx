import UserMenu from './UserMenu'
import { renderWithProviders } from '~/services'

describe('UserMenu match snapshot', () => {
  it('UserMenu', () => {
    const { container } = renderWithProviders(<UserMenu />)
    expect(container).toMatchSnapshot()
  })
})
