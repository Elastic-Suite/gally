import Badge from './Badge'
import { renderWithProviders } from '~/services'

describe('Badge', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(<Badge>Hello world</Badge>)
    expect(container).toMatchSnapshot()
  })
})

describe('BadgeSuccess', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Badge color="success">Hello world</Badge>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('BadgeWarning', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Badge color="warning">Hello world</Badge>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('BadgeError', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Badge color="error">Hello world</Badge>
    )
    expect(container).toMatchSnapshot()
  })
})
