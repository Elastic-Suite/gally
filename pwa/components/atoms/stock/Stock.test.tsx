import { renderWithProviders } from '~/utils/tests'
import Stock from './Stock'

describe('Stock', () => {
  it('Should match snapschot', () => {
    const { container } = renderWithProviders(<Stock stock />)
    expect(container).toMatchSnapshot()
  })
})
