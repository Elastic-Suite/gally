import { renderWithProviders } from '~/utils/tests'

import catalog from '../../../../public/mocks/catalog.json'

import ActiveLocales from './ActiveLocales'

jest.mock('react-i18next')

describe('ActiveLocales match snapshot', () => {
  it('ActiveLocales simple', () => {
    const { container } = renderWithProviders(
      <ActiveLocales content={catalog} />
    )
    expect(container).toMatchSnapshot()
  })
})
