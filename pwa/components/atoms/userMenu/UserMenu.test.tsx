import UserMenu from './UserMenu'
import { renderWithProviders } from '~/services'

describe('UserMenu', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(<UserMenu />)
    expect(container).toMatchSnapshot()
  })
})
