import BreadCrumbs from './BreadCrumbs'
import { renderWithProviders } from '~/services'
import menu from '../../../public/mocks/menu.json'

describe('BreadCrumbs', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <BreadCrumbs
        slug={['search', 'configuration', 'autocompletion']}
        menu={menu}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
