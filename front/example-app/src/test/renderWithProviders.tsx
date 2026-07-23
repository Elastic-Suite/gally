import { render } from '@testing-library/react'
import { MemoryRouter, parsePath, Route, Routes } from 'react-router'
import { CartProvider } from '../context/CartContext'
import { LocaleProvider } from '../context/LocaleContext'
import type { ReactElement } from 'react'

export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    path,
    state,
  }: { route?: string; path?: string; state?: unknown } = {},
) {
  const content = path ? (
    <Routes>
      <Route path={path} element={ui} />
    </Routes>
  ) : (
    ui
  )

  return render(
    <MemoryRouter initialEntries={[{ ...parsePath(route), state }]}>
      <LocaleProvider>
        <CartProvider>{content}</CartProvider>
      </LocaleProvider>
    </MemoryRouter>,
  )
}
