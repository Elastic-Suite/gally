import { screen, waitFor } from '@testing-library/react'

import { renderWithProviders } from '../../utils/tests'

import Header from './Header'

describe('Header', () => {
  it('match snapshot', async () => {
    const { container } = renderWithProviders(
      <Header catalogId="" localizedCatalogId="" />
    )
    await waitFor(() => {
      const select = screen.getByTestId('header-catalog-select')
      return expect(select.dataset.testlength).toEqual('3')
    })
    expect(container).toMatchSnapshot()
  })
})
