import { renderWithProviders } from '~/utils/tests'

import catalog from '../../../../public/mocks/catalog.json'

import Catalogs from './Catalogs'

jest.mock('react-i18next')

describe('Catalogs match snapshot', () => {
  it('Catalogs simple', () => {
    const { container } = renderWithProviders(<Catalogs content={catalog} />)
    expect(container).toMatchSnapshot()
  })
})
