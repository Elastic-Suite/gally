import { RenderOptions, render, renderHook } from '@testing-library/react'
import { PreloadedState } from '@reduxjs/toolkit'
import { ReactNode } from 'react'
import { api } from 'shared'

import AppProvider from '~/components/stateful-providers/AppProvider/AppProvider'
import { AppStore, RootState, setupStore } from '~/store'

import TestProvider from './TestProvider'

export interface IExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

export interface IRenderOutput {
  store: AppStore
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: IExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return (
      <AppProvider store={store}>
        <TestProvider api={api}>{children}</TestProvider>
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
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: IExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return (
      <AppProvider store={store}>
        <TestProvider api={api}>{children}</TestProvider>
      </AppProvider>
    )
  }
  return { store, ...renderHook(hook, { wrapper: Wrapper, ...renderOptions }) }
}
