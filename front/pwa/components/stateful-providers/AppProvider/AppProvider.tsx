import { ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/styled-engine'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'

import { theme } from 'shared'
import { AppStore } from '~/store'

import Alert from '~/components/atoms/Alert/Alert'
import BreadcrumbProvider from '~/components/stateful-providers/BreadcrumbProvider/BreadcrumbProvider'

import I18nProvider from '../I18nProvider/I18nProvider'

interface IProps {
  children: ReactNode
  store: AppStore
}

function AppProvider(props: IProps): JSX.Element {
  const { children, store } = props

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          <SnackbarProvider
            Components={{
              default: Alert,
              error: Alert,
              info: Alert,
              success: Alert,
              warning: Alert,
            }}
            autoHideDuration={5000}
            maxSnack={3}
          >
            <I18nProvider>
              <BreadcrumbProvider>{children}</BreadcrumbProvider>
            </I18nProvider>
          </SnackbarProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default AppProvider
