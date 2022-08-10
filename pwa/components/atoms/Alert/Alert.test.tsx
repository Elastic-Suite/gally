import { renderWithProviders } from '~/utils/tests'

import Alert from './Alert'

describe('Alert', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(<Alert message="Hello World" />)
    expect(container).toMatchSnapshot()
  })
})
