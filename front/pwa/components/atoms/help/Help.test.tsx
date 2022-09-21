import { renderWithProviders } from '~/utils/tests'

import Help from './Help'

describe('Help match snapshot', () => {
  it('Help simple', () => {
    const { container } = renderWithProviders(<Help />)
    expect(container).toMatchSnapshot()
  })
})
