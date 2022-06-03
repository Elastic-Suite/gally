import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MenuChild {
  code: string
  label: string
  children: MenuChild[]
}

interface Menu {
  hierarchy: MenuChild[]
}

interface MenuState {
  menu: Menu
  menuItemActive: string
  sidebarState: boolean
  sidebarStateTimeout: boolean
  childrenState: Record<string, boolean>
}

const initialState: MenuState = {
  menu: {
    hierarchy: [],
  },
  menuItemActive: '',
  sidebarState: true,
  sidebarStateTimeout: false,
  childrenState: {},
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setChildState(
      state,
      action: PayloadAction<{ code: string; value: boolean }>
    ) {
      state.childrenState[action.payload.code] = action.payload.value
    },
    setMenu(state, action: PayloadAction<Menu>) {
      state.menu = action.payload
    },
    setMenuItemActive(state, action: PayloadAction<string>) {
      state.menuItemActive = action.payload
    },
    setSidebarState(state, action: PayloadAction<boolean>) {
      state.sidebarState = action.payload
    },
    setSidebarStateTimeout(state, action: PayloadAction<boolean>) {
      state.sidebarStateTimeout = action.payload
    },
  },
})

export const {
  setChildState,
  setMenu,
  setMenuItemActive,
  setSidebarState,
  setSidebarStateTimeout,
} = menuSlice.actions
export const menuReducer = menuSlice.reducer
