import AlertInfoMessage from './AlertInfoMessage'
import { renderWithProviders } from '~/services'

describe('AlertInfoMessage match snapshot', () => {
  it('AlertInfoMessageDevFalse', () => {
    const { container } = renderWithProviders(
      <AlertInfoMessage title="Hello World" dev={false} />
    )
    expect(container).toMatchSnapshot()
  })

  it('AlertInfoMessageDevTrue', () => {
    const { container } = renderWithProviders(
      <AlertInfoMessage title="Hello World" dev />
    )
    expect(container).toMatchSnapshot()
  })
})
