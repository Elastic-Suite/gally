import Breadcrumbs from './Breadcrumbs'
import { renderWithProviders } from '~/services'
import menu from '../../../public/mocks/menu.json'

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
