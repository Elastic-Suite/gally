import { ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/styled-engine'
import { Provider } from 'react-redux'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import 'dayjs/locale/fr';
import 'dayjs/locale/en';

import { theme } from 'shared'
import { AppStore } from '~/store'

import BreadcrumbProvider from '~/components/stateful-providers/BreadcrumbProvider/BreadcrumbProvider'
import { MuiPickersAdapter } from '@mui/x-date-pickers/internals/models'
import { useTranslation } from 'next-i18next'


function CustomAdapter(options): new () => MuiPickersAdapter<unknown> {
  const adapter = new AdapterDayjs(options);
  const constructDayObject = (day: string): {charAt: () => string} => ({ charAt: () => day });

  return {
    ...adapter,

    getWeekdays(): {charAt: () => string}[] {
      const customWeekdays = adapter.getWeekdays();
      return customWeekdays.map((day): {charAt: () => string} => constructDayObject(day));
    }

  };
}

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
          <LocalizationProvider dateAdapter={CustomAdapter} adapterLocale={i18n.language}>
            <BreadcrumbProvider>{children}</BreadcrumbProvider>
          </LocalizationProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default AppProvider
