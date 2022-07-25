import User from './User'
import { renderWithProviders } from '~/services'

describe('User', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(<User />)
    expect(container).toMatchSnapshot()
  })
})
