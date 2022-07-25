import AppBar from './AppBar'
import { renderWithProviders } from '~/services'
import menu from '../../../../public/mocks/menu.json'

describe('AppBar', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <AppBar slug={['search']} menu={menu} />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('AppBarTwoSlug', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <AppBar slug={['search', 'configuration']} menu={menu} />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('AppBarThreeSlug', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <AppBar
        slug={['search', 'configuration', 'autocompletion']}
        menu={menu}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
