import { render } from '@testing-library/react'
import MenuItemIcon from './MenuItemIcon'
import { Provider } from 'react-redux'
import { store } from '~/store'
import { ThemeProvider } from '@mui/material/styles'
import RegularTheme from '~/components/atoms/RegularTheme'

const wrapper = ({ children }) => (
  <Provider store={store}>
    <ThemeProvider theme={RegularTheme}>{children}</ThemeProvider>
  </Provider>
)

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
