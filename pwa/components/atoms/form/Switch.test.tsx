import { Switch } from '@mui/material'
import { renderWithProviders } from '~/services'

describe('Switch match snapshot', () => {
  it('Switch desabled', () => {
    const { container } = renderWithProviders(<Switch disabled />)
    expect(container).toMatchSnapshot()
  })

  it('Switch desabled false', () => {
    const { container } = renderWithProviders(<Switch disabled={false} />)
    expect(container).toMatchSnapshot()
  })

  it('Switch defaultChecked true', () => {
    const { container } = renderWithProviders(<Switch defaultChecked />)
    expect(container).toMatchSnapshot()
  })

  it('Switch defaultChecked false', () => {
    const { container } = renderWithProviders(<Switch defaultChecked={false} />)
    expect(container).toMatchSnapshot()
  })

  it('Switch value is Hello', () => {
    const { container } = renderWithProviders(<Switch value="Hello" />)
    expect(container).toMatchSnapshot()
  })

  it('Switch onChange is console.log("Hello")', () => {
    const { container } = renderWithProviders(
      <Switch onChange={(): void => console.log('Hello')} />
    )
    expect(container).toMatchSnapshot()
  })
})
