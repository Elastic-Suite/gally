import { RenderOptions, render, renderHook } from '@testing-library/react'
import { PreloadedState } from '@reduxjs/toolkit'
import { ReactNode } from 'react'
import { Bundle, IUser, api } from 'shared'

import { AppStore, RootState, setupStore } from '~/store'

import AppProvider from '~/components/stateful-providers/AppProvider/AppProvider'

import TestProvider from './TestProvider'

export interface IExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

export interface IRenderOutput {
  store: AppStore
}

const timestamp = Math.floor(Date.now() / 1000)
const expires = 8 * 60 * 60 // 8 hours

const user = {
  iat: timestamp,
  exp: timestamp + expires,
  roles: ['ROLE_ADMIN', 'ROLE_CONTRIBUTOR'],
  username: 'admin@example.com',
} as IUser

const defaultState = {
  data: { api, bundles: [Bundle.VIRTUAL_CATEGORY] },
  user: {
    requestedPath: '',
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NTk5NTM1NDQsImV4cCI6MTY1OTk4MjM0NCwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfQ09OVFJJQlVUT1IiXSwidXNlcm5hbWUiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ZNE2SHmtm9WgWEMmKGMjpcfEym2ysxC_CVcLtzlpuT3jlT0Zyz4VjoQHdTav9I7s9b2QzpeDNt3Sfrbka8IHcVb_TvZle_vII-TkQGal37RtXxKk_EMMQQlzLRO3zDWYy2I0ZPXv6iMlaSWOya4egOG2s1_tzFf4MnNNm2zEQbjzAtZ_Ij9UBMlSxK19AHvHlKU9AelA-NepjUdl6f4GxYPnyIwZw3PS294Wtffj7Kzw1ZZywDljl1xN_flg70cuO0GGkUqBNHrf7zBjPmXbAZZDAefoyQfVqB2v4GzDJfO847XymvBlHtCCjWx0ThK5afyOGL2MAAZkl-AoNjMcjA',
    user,
  },
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = defaultState,
    store,
    ...renderOptions
  }: IExtendedRenderOptions = {}
) {
  store = store ?? setupStore(preloadedState)
  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return (
      <AppProvider store={store}>
        <TestProvider>{children}</TestProvider>
      </AppProvider>
    )
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function renderHookWithProviders<R>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hook: (props: any) => R,
  {
    preloadedState = defaultState,
    store,
    ...renderOptions
  }: IExtendedRenderOptions = {}
) {
  store = store ?? setupStore(preloadedState)
  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return (
      <AppProvider store={store}>
        <TestProvider>{children}</TestProvider>
      </AppProvider>
    )
  }
  return { store, ...renderHook(hook, { wrapper: Wrapper, ...renderOptions }) }
}
