import { render } from '@testing-library/react'
import IonIcon from './IonIcon'

describe('IonIcon', () => {
  it('match snapshot for basic icon', () => {
    const { container } = render(<IonIcon name="home" />)
    expect(container).toMatchSnapshot()
  })

  it('match snapshot for custom icon', () => {
    const { container } = render(<IonIcon name="dashboard" />)
    expect(container).toMatchSnapshot()
  })

  it('match snapshot for alias icon', () => {
    const { container } = render(<IonIcon name="analyze" />)
    expect(container).toMatchSnapshot()
  })
})
