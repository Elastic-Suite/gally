import { renderWithProviders } from '~/utils/tests'

import menu from '../../../../public/mocks/menu.json'

import Sidebar from './Sidebar'

describe('SideBar match snapshot', () => {
  it('SideBarStateTrue', () => {
    const { container } = renderWithProviders(
      <Sidebar
        menu={menu}
        menuItemActive="analyze_catalog_structure"
        sidebarState
        sidebarStateTimeout={false}
        childrenState={{}}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('SideBarStateFalse', () => {
    const { container } = renderWithProviders(
      <Sidebar
        menu={menu}
        menuItemActive="analyze_catalog_structure"
        sidebarState={false}
        sidebarStateTimeout={false}
        childrenState={{}}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
