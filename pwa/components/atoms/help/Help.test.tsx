import Help from './Help'
import { renderWithProviders } from '~/services'

describe('Help', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(<Help />)
    expect(container).toMatchSnapshot()
  })
})
