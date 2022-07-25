import { Suspense } from 'react'
import AppProvider from '~/components/AppProvider'

import I18nProvider from './I18nProvider'

import { api } from '~/mocks'
import { setupStore } from '~/store'

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
    const store = setupStore()
    return (
      <I18nProvider locale={context.globals.locale}>
        <AppProvider api={api} store={store}>
          <Suspense fallback="">
            <Story />
          </Suspense>
        </AppProvider>
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
