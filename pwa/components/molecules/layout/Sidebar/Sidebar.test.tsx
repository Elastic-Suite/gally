import Sidebar from './Sidebar'
import { renderWithProviders } from '~/services'
import menu from '../../../../public/mocks/menu.json'

describe('SideBarStateTrue', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Sidebar
        menu={menu}
        menuItemActive="analyze_catalog_structure"
        sidebarState
        sidebarStateTimeout={false}
        childrenState={{}}
        onChildToggle={(): void => console.log('hello world')}
      />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('SideBarStateFalse', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Sidebar
        menu={menu}
        menuItemActive="analyze_catalog_structure"
        sidebarState={false}
        sidebarStateTimeout={false}
        childrenState={{}}
        onChildToggle={(): void => console.log('hello world')}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
