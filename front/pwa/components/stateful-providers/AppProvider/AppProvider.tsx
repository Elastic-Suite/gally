import { ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/styled-engine'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useTranslation } from 'next-i18next'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'

import { theme } from 'shared'
import { AppStore } from '~/store'

import Alert from '~/components/atoms/Alert/Alert'
import BreadcrumbProvider from '~/components/stateful-providers/BreadcrumbProvider/BreadcrumbProvider'

interface IProps {
  children: ReactNode
  store: AppStore
}

function AppProvider(props: IProps): JSX.Element {
  const { children, store } = props
  const { i18n } = useTranslation()

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
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={i18n.language}
            >
              <BreadcrumbProvider>{children}</BreadcrumbProvider>
            </LocalizationProvider>
          </SnackbarProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default AppProvider
