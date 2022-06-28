import AppProvider from '~/components/AppProvider'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}))

export const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>
