import { render } from '@testing-library/react'
import MenuItemIcon from './MenuItemIcon'

import { wrapper } from '~/utils/tests'

describe('MenuItemIcon', () => {
  it('render properly lightStyle with no child (Settings)', () => {
    const { container } = render(
      <MenuItemIcon
        href="settings"
        code="settings"
        label="Settings"
        lightStyle
        childPadding={false}
      />,
      { wrapper }
    )

    expect(container).toBeTruthy()
  })

  it('match snapshot with boldStyle and child (Analyze)', () => {
    const { container } = render(
      <MenuItemIcon
        href="analyze"
        code="analyze"
        label="Analyze"
        lightStyle={false}
        childPadding
      />,
      { wrapper }
    )

    expect(container).toMatchSnapshot()
  })
})
