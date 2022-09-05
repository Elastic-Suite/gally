import { Suspense } from 'react'

import { api } from '~/mocks'
import { setupStore } from '~/store'
import TestProvider from '~/utils/TestProvider'

import AppProvider from '~/components/stateful-providers/AppProvider/AppProvider'

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
    const store = setupStore()
    return (
      <Suspense fallback="">
        <I18nProvider locale={context.globals.locale}>
          <AppProvider store={store}>
            <TestProvider api={api}>
              <Story />
            </TestProvider>
          </AppProvider>
        </I18nProvider>
      </Suspense>
    )
  },
]

export const globalTypes = {
  locale: {
    name: 'Locale',
    title: 'Locale',
    description: 'Global locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'fr', right: '🇫🇷', title: 'Français' },
      ],
      dynamicTitle: true,
    },
  },
}
