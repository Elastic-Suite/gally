import { renderWithProviders } from '~/utils/tests'
import Price from './Price'

describe('Price', () => {
  it('Should match snapschot', () => {
    const { container } = renderWithProviders(
      <Price price={100} countryCode="fr-FR" currency="EUR" />
    )
    expect(container).toMatchSnapshot()
  })
})
