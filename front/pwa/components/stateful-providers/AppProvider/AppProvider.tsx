import { ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/styled-engine'
import { Provider } from 'react-redux'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import { theme } from 'shared'
import { AppStore } from '~/store'

import BreadcrumbProvider from '~/components/stateful-providers/BreadcrumbProvider/BreadcrumbProvider'

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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <BreadcrumbProvider>{children}</BreadcrumbProvider>
          </LocalizationProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default AppProvider
