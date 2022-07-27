import { Dispatch, ReactChild, SetStateAction, useMemo, useState } from 'react'
import { Api } from '@api-platform/api-doc-parser'
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/styled-engine'
import { Provider } from 'react-redux'

import { theme } from '~/constants'
import { breadcrumbContext, resourcesContext } from '~/contexts'
import { AppStore } from '~/store'

interface IProps {
  api: Api
  children: ReactChild
  store: AppStore
}

function AppProvider(props: IProps): JSX.Element {
  const { api, children, store } = props
  const [breadcrumb, setBreadcrumb] = useState([])
  const breadcrumbContextValue: [string[], Dispatch<SetStateAction<string[]>>] =
    useMemo(() => [breadcrumb, setBreadcrumb], [breadcrumb])

  return (
    <resourcesContext.Provider value={api}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StyledEngineProvider injectFirst>
            <breadcrumbContext.Provider value={breadcrumbContextValue}>
              {children}
            </breadcrumbContext.Provider>
          </StyledEngineProvider>
        </ThemeProvider>
      </Provider>
    </resourcesContext.Provider>
  )
}

export default AppProvider
