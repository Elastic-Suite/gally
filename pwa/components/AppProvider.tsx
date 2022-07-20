import { ReactChild } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/styled-engine'
import { Provider } from 'react-redux'

import theme from '~/constants/theme'
import { AppStore } from '~/store'

interface IProps {
  children: ReactChild
  store: AppStore
}

function AppProvider(props: IProps): JSX.Element {
  const { children, store } = props
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default AppProvider
