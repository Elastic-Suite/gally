import { renderWithProviders } from '~/utils/tests'

import Chip from './Chip'

describe('Chip', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(<Chip label="Hello world" />)
    expect(container).toMatchSnapshot()
  })

  it('match snapshot (color success)', () => {
    const { container } = renderWithProviders(
      <Chip color="success" label="Hello world" />
    )
    expect(container).toMatchSnapshot()
  })

  it('match snapshot (color warning)', () => {
    const { container } = renderWithProviders(
      <Chip color="warning" label="Hello world" />
    )
    expect(container).toMatchSnapshot()
  })

  it('match snapshot (color error)', () => {
    const { container } = renderWithProviders(
      <Chip color="error" label="Hello world" />
    )
    expect(container).toMatchSnapshot()
  })
})
