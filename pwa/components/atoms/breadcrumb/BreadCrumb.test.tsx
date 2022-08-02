import menu from '../../../public/mocks/menu.json'

import { renderWithProviders } from '~/utils/tests'

import Breadcrumbs from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Breadcrumbs
        slug={['search', 'configuration', 'autocompletion']}
        menu={menu}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
