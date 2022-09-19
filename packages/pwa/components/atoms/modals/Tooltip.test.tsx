import { renderWithProviders } from '~/utils/tests'

import Tooltips from './Tooltip'

describe('Tooltip match snapshot', () => {
  it('TooltipLeft', () => {
    const { container } = renderWithProviders(
      <Tooltips title="Hello World" placement="left">
        <span>Hello World</span>
      </Tooltips>
    )
    expect(container).toMatchSnapshot()
  })

  it('TooltipRight', () => {
    const { container } = renderWithProviders(
      <Tooltips title="Hello World" placement="right">
        <span>Hello World</span>
      </Tooltips>
    )
    expect(container).toMatchSnapshot()
  })

  it('TooltipTop', () => {
    const { container } = renderWithProviders(
      <Tooltips title="Hello World" placement="top">
        <span>Hello World</span>
      </Tooltips>
    )
    expect(container).toMatchSnapshot()
  })

  it('TooltipBottom', () => {
    const { container } = renderWithProviders(
      <Tooltips title="Hello World" placement="bottom">
        <span>Hello World</span>
      </Tooltips>
    )
    expect(container).toMatchSnapshot()
  })
})
