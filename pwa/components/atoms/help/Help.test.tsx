import Help from './Help'
import { renderWithProviders } from '~/services'

describe('Help match snapshot', () => {
  it('Help simple', () => {
    const { container } = renderWithProviders(<Help />)
    expect(container).toMatchSnapshot()
  })
})
