import Badge from './Badge'
import { renderWithProviders } from '~/services'

describe('Badge match snapshot', () => {
  it('Badge simple', () => {
    const { container } = renderWithProviders(<Badge>Hello world</Badge>)
    expect(container).toMatchSnapshot()
  })

  it('Badge color success', () => {
    const { container } = renderWithProviders(
      <Badge color="success">Hello world</Badge>
    )
    expect(container).toMatchSnapshot()
  })

  it('Badge color warning', () => {
    const { container } = renderWithProviders(
      <Badge color="warning">Hello world</Badge>
    )
    expect(container).toMatchSnapshot()
  })

  it('Badge color error', () => {
    const { container } = renderWithProviders(
      <Badge color="error">Hello world</Badge>
    )
    expect(container).toMatchSnapshot()
  })
})
