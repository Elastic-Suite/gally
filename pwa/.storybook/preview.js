import { StyledEngineProvider } from '@mui/styled-engine'
import { ThemeProvider } from '@mui/material/styles'
import RegularTheme from '~/components/atoms/RegularTheme'

import '~/assets/scss/style.scss'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true,
    matchers: {
      color: /color$/i,
      date: /date$/i,
    },
  },
}

export const decorators = [
  (Story) => (
    <ThemeProvider theme={RegularTheme}>
      <StyledEngineProvider injectFirst>
        <Story />
      </StyledEngineProvider>
    </ThemeProvider>
  ),
]
