import { renderWithProviders } from '~/utils/tests'

import UserMenu from './UserMenu'

describe('UserMenu match snapshot', () => {
  it('UserMenu', () => {
    const { container } = renderWithProviders(<UserMenu />)
    expect(container).toMatchSnapshot()
  })
})
