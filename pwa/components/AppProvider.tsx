import { ReactChild } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/styled-engine'
import { Provider } from 'react-redux'

import { store } from '~/store'
import theme from '~/constants/theme'

interface IProps {
  children: ReactChild
}

function AppProvider(props: IProps): JSX.Element {
  const { children } = props
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default AppProvider
