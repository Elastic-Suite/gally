import { Suspense } from 'react'
import { StyledEngineProvider } from '@mui/styled-engine'
import { ThemeProvider } from '@mui/material/styles'
import RegularTheme from '~/components/atoms/RegularTheme'

import I18nProvider from './I18nProvider'

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
  (Story, context) => {
    return (
      <I18nProvider locale={context.globals.locale}>
        <ThemeProvider theme={RegularTheme}>
          <StyledEngineProvider injectFirst>
            <Suspense fallback="">
              <Story />
            </Suspense>
          </StyledEngineProvider>
        </ThemeProvider>
      </I18nProvider>
    )
  },
]

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Global locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'fr', right: '🇫🇷', title: 'Français' },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
}
