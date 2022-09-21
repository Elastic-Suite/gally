import { renderWithProviders } from '~/utils/tests'

import StickyBar from './StickyBar'

describe('StickyBar', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(
      <StickyBar show>
        <div>Hello Sticky</div>
      </StickyBar>
    )
    expect(container).toMatchSnapshot()
  })
})
