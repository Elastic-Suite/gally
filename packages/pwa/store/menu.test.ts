import { IFetch, IMenu, LoadStatus } from 'shared'
import {
  IMenuState,
  RootState,
  menuReducer,
  selectChildrenState,
  selectMenu,
  selectMenuItemActive,
  selectSidebarState,
  selectSidebarStateTimeout,
  setChildState,
  setMenu,
  setMenuItemActive,
  setSidebarState,
  setSidebarStateTimeout,
} from '.'

const initialState: IMenuState = {
  menu: {
    status: LoadStatus.IDLE,
    data: {
      hierarchy: [],
    },
  },
  menuItemActive: '',
  sidebarState: true,
  sidebarStateTimeout: false,
  childrenState: {},
}

const rootState = {
  menu: {
    ...initialState,
  },
} as unknown as RootState

describe('Test menu', () => {
  it('Should return initial menu', () => {
    expect(menuReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  it('Should set Childstate', () => {
    const previoustate = {
      childrenState: {
        test: false,
      },
    } as unknown as IMenuState
    expect(
      menuReducer(previoustate, setChildState({ code: 'test', value: true }))
    ).toEqual({
      childrenState: {
        test: true,
      },
    })
  })

  it('Should set Menu', () => {
    const previoustate = {
      menu: {
        status: LoadStatus.LOADING,
        data: {
          hierarchy: [],
        },
      },
    } as unknown as IMenuState

    const payLoadAction = {
      data: [
        {
          code: 'test',
          label: 'test',
          children: [],
        },
      ],
    } as unknown as IFetch<IMenu>

    expect(menuReducer(previoustate, setMenu(payLoadAction))).toEqual({
      menu: {
        status: LoadStatus.LOADING,
        ...payLoadAction,
      },
    })
  })

  it('Should set MenuItemActive', () => {
    const previousState = {
      menuItemActive: '',
    } as unknown as IMenuState

    expect(
      menuReducer(previousState, setMenuItemActive('testMenuItemActive'))
    ).toEqual({ menuItemActive: 'testMenuItemActive' })
  })

  it('Should set SidebarState', () => {
    const previousState = {
      sidebarState: false,
    } as unknown as IMenuState

    expect(menuReducer(previousState, setSidebarState(true))).toEqual({
      sidebarState: true,
    })
  })

  it('Should set SidebarStateTimeout', () => {
    const previousState = {
      sidebarStateTimeout: false,
    } as unknown as IMenuState

    expect(menuReducer(previousState, setSidebarStateTimeout(true))).toEqual({
      sidebarStateTimeout: true,
    })
  })

  it('Should select children state', () => {
    expect(selectChildrenState(rootState)).toEqual({})
  })

  it('Should select menu', () => {
    expect(selectMenu(rootState)).toEqual({
      hierarchy: [],
    })
  })

  it('Should select menu item active', () => {
    expect(selectMenuItemActive(rootState)).toEqual('')
  })

  it('Should select sidebar state', () => {
    expect(selectSidebarState(rootState)).toEqual(true)
  })

  it('Should select sidebar state timeout', () => {
    expect(selectSidebarStateTimeout(rootState)).toEqual(false)
  })
})
