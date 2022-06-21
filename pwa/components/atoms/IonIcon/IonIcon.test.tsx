import { render } from '@testing-library/react'
import IonIcon from './IonIcon'

describe('IonIcon', () => {
  it('render properly dashboard', () => {
    const { container } = render(<IonIcon name="dashboard" />)
    expect(container).toBeTruthy()
  })
  it('render properly analyze', () => {
    const { container } = render(<IonIcon name="analyze" />)
    expect(container).toBeTruthy()
  })
  it('render properly merchandize', () => {
    const { container } = render(<IonIcon name="merchandize" />)
    expect(container).toBeTruthy()
  })
  it('render properly monitoring', () => {
    const { container } = render(<IonIcon name="monitoring" />)
    expect(container).toBeTruthy()
  })
  it('render properly settings', () => {
    const { container } = render(<IonIcon name="settings" />)
    expect(container).toBeTruthy()
  })

  it('match snapshot', () => {
    const { container } = render(<IonIcon name="home" />)
    expect(container).toMatchSnapshot()
  })
})
