import { RenderOptions, render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { PreloadedState } from '@reduxjs/toolkit'
import { ReactChild } from 'react'

import AppProvider from '~/components/AppProvider'
import { AppStore, RootState, setupStore } from '~/store'

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
  function Wrapper({ children }: { children: ReactChild }): JSX.Element {
    return <AppProvider store={store}>{children}</AppProvider>
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
  function Wrapper({ children }: { children: ReactChild }): JSX.Element {
    return <AppProvider store={store}>{children}</AppProvider>
  }
  return { store, ...renderHook(hook, { wrapper: Wrapper, ...renderOptions }) }
}
