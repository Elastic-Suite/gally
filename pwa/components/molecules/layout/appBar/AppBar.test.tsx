import AppBar from './AppBar'
import { renderWithProviders } from '~/services'
import menu from '../../../../public/mocks/menu.json'

describe('AppBar match snapshot', () => {
  it('AppBar simple', () => {
    const { container } = renderWithProviders(
      <AppBar slug={['search']} menu={menu} />
    )
    expect(container).toMatchSnapshot()
  })

  it('AppBarTwoSlug', () => {
    const { container } = renderWithProviders(
      <AppBar slug={['search', 'configuration']} menu={menu} />
    )
    expect(container).toMatchSnapshot()
  })

  it('AppBarThreeSlug', () => {
    const { container } = renderWithProviders(
      <AppBar
        slug={['search', 'configuration', 'autocompletion']}
        menu={menu}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
