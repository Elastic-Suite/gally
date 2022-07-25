import AlertInfoMessage from './AlertInfoMessage'
import { renderWithProviders } from '~/services'

describe('AlertInfoMessageDevFalse', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <AlertInfoMessage title="Hello World" dev={false} />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('AlertInfoMessageDevTrue', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <AlertInfoMessage title="Hello World" dev />
    )
    expect(container).toMatchSnapshot()
  })
})
