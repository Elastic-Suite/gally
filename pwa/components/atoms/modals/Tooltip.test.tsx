import Tooltips from './Tooltip'
import { renderWithProviders } from '~/services'

describe('TooltipLeft', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Tooltips title="Hello World" placement="left">
        <span>Hello World</span>
      </Tooltips>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('TooltipRight', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Tooltips title="Hello World" placement="right">
        <span>Hello World</span>
      </Tooltips>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('TooltipTop', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Tooltips title="Hello World" placement="top">
        <span>Hello World</span>
      </Tooltips>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('TooltipBottom', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Tooltips title="Hello World" placement="bottom">
        <span>Hello World</span>
      </Tooltips>
    )
    expect(container).toMatchSnapshot()
  })
})
