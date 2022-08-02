import { renderWithProviders } from '~/utils/tests'

import User from './User'

describe('User', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(<User />)
    expect(container).toMatchSnapshot()
  })
})
