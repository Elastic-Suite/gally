import { render } from '@testing-library/react'
import IonIcon from './IonIcon'

describe('IonIcon', () => {
  it('render properly dashboard & match snapshot', () => {
    const { container } = render(<IonIcon name="dashboard" />)
    expect(container).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  it('render properly analyze & match snapshot', () => {
    const { container } = render(<IonIcon name="analyze" />)
    expect(container).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  it('render properly merchandize & match snapshot', () => {
    const { container } = render(<IonIcon name="merchandize" />)
    expect(container).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  it('render properly monitoring & match snapshot', () => {
    const { container } = render(<IonIcon name="monitoring" />)
    expect(container).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  it('render properly settings & match snapshot', () => {
    const { container } = render(<IonIcon name="settings" />)
    expect(container).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  it('render properly home & match snapshot', () => {
    const { container } = render(<IonIcon name="home" />)
    expect(container).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  it('render properly information & match snapshot', () => {
    const { container } = render(<IonIcon name="information" />)
    expect(container).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  it('render properly information with tooltip & match snapshot', () => {
    const { container } = render(<IonIcon name="information" tooltip />)
    expect(container).toBeTruthy()
    expect(container).toMatchSnapshot()
  })
})
