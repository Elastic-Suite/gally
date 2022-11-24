import { renderWithProviders } from '~/utils/tests'

import User from './User'

describe('User', () => {
  it('match snapshot not connected', () => {
    const { container } = renderWithProviders(
      <User isConnectedWithValidJwt={false} />
    )
    expect(container).toMatchSnapshot()
  })

  it('match snapshot connected', () => {
    const { container } = renderWithProviders(<User isConnectedWithValidJwt />)
    expect(container).toMatchSnapshot()
  })
})
