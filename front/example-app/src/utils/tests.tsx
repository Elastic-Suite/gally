import { RenderOptions, render, renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ReactNode } from 'react'
import { api } from 'gally-admin-shared'

import TestProvider from './TestProvider'

export type IExtendedRenderOptions = Omit<RenderOptions, 'queries'>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function renderWithProviders(
  ui: React.ReactElement,
  renderOptions: IExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return (
      <MemoryRouter>
        <TestProvider api={api}>{children}</TestProvider>
      </MemoryRouter>
    )
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function renderHookWithProviders<R>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hook: (props: any) => R,
  renderOptions: IExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return (
      <MemoryRouter>
        <TestProvider api={api}>{children}</TestProvider>
      </MemoryRouter>
    )
  }
  return renderHook(hook, { wrapper: Wrapper, ...renderOptions })
}
