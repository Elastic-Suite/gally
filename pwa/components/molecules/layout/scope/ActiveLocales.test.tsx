import ActiveLocales from './ActiveLocales'
import { renderWithProviders } from '~/services'
import catalog from '../../../../public/mocks/catalog.json'

describe('ActiveLocales match snapshot', () => {
  it('ActiveLocales simple', () => {
    const { container } = renderWithProviders(
      <ActiveLocales content={catalog} />
    )
    expect(container).toMatchSnapshot()
  })
})
