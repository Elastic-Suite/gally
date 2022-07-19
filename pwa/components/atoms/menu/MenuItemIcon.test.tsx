import MenuItemIcon from './MenuItemIcon'

import { renderWithProviders } from '~/services'

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
