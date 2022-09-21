import { RenderOptions, render, renderHook } from '@testing-library/react'
import { ReactNode } from 'react'

import { schemaContext } from '../contexts'
import { api } from '../mocks'

export type IExtendedRenderOptions = Omit<RenderOptions, 'queries'>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function renderWithProviders(
  ui: React.ReactElement,
  renderOptions: IExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return (
      <schemaContext.Provider value={api}>{children}</schemaContext.Provider>
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
      <schemaContext.Provider value={api}>{children}</schemaContext.Provider>
    )
  }
  return renderHook(hook, { wrapper: Wrapper, ...renderOptions })
}
