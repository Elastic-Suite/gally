import { renderWithProviders } from '../../utils/tests'

import Header from './Header'

describe('Alert', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(<Header/>)
    expect(container).toMatchSnapshot()
  })
})
