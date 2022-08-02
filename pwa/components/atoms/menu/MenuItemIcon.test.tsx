import { renderWithProviders } from '~/utils/tests'

import MenuItemIcon from './MenuItemIcon'

describe('MenuItemIcon', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <MenuItemIcon
        href="analyze"
        code="analyze"
        label="Analyze"
        childPadding
      />
    )
    expect(container).toMatchSnapshot()
  })
})
