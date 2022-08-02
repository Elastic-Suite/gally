import { Dispatch, ReactChild, SetStateAction, useMemo, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/styled-engine'
import { Provider } from 'react-redux'

import { theme } from '~/constants'
import { breadcrumbContext, schemaContext } from '~/contexts'
import { AppStore } from '~/store'
import { IApi } from '~/types'

interface IProps {
  api: IApi
  children: ReactChild
  store: AppStore
}

function AppProvider(props: IProps): JSX.Element {
  const { api, children, store } = props
  const [breadcrumb, setBreadcrumb] = useState([])
  const breadcrumbContextValue: [string[], Dispatch<SetStateAction<string[]>>] =
    useMemo(() => [breadcrumb, setBreadcrumb], [breadcrumb])

  return (
    <schemaContext.Provider value={api}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StyledEngineProvider injectFirst>
            <breadcrumbContext.Provider value={breadcrumbContextValue}>
              {children}
            </breadcrumbContext.Provider>
          </StyledEngineProvider>
        </ThemeProvider>
      </Provider>
    </schemaContext.Provider>
  )
}

export default AppProvider
