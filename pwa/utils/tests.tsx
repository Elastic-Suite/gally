import { ReactChild } from 'react'

import AppProvider from '~/components/AppProvider'

jest.mock('react-i18next', () => ({
  useTranslation: (): { t: (key: string) => string } => ({
    t: (key: string) => key,
  }),
}))

export function wrapper({ children }: { children: ReactChild }): JSX.Element {
  return <AppProvider>{children}</AppProvider>
}
