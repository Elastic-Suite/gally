import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IFetch } from '~/types'

export interface IMenuChild {
  code: string
  label: string
  children: IMenuChild[]
}

export interface IMenu {
  hierarchy: IMenuChild[]
}

export interface IMenuState {
  menu: IFetch<IMenu>
  menuItemActive: string
  sidebarState: boolean
  sidebarStateTimeout: boolean
  childrenState: Record<string, boolean>
}

const initialState: IMenuState = {
  menu: {
    loading: false,
    data: {
      hierarchy: [],
    },
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
    setMenu(state, action: PayloadAction<IFetch<IMenu>>) {
      state.menu = {
        ...state.menu,
        ...action.payload,
      }
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

export const selectChildrenState = (state, code: string) =>
  state.menu.childrenState[code]
export const selectMenu = (state) => state.menu.menu.data
export const selectMenuItemActive = (state) => state.menu.menuItemActive
export const selectSidebarState = (state) => state.menu.sidebarState
export const selectSidebarStateTimeout = (state) =>
  state.menu.sidebarStateTimeout
