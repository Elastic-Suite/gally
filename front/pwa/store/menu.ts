import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { IFetch, IMenu, LoadStatus } from 'shared'

import { RootState } from './store'

export interface IMenuState {
  menu: IFetch<IMenu>
  menuItemActive: string
  sidebarState: boolean
  sidebarStateTimeout: boolean
  childrenState: Record<string, boolean>
}

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

export const selectChildrenState = (
  state: RootState
): Record<string, boolean> => state.menu.childrenState
export const selectMenu = (state: RootState): IMenu => state.menu.menu.data
export const selectMenuItemActive = (state: RootState): string =>
  state.menu.menuItemActive
export const selectSidebarState = (state: RootState): boolean =>
  state.menu.sidebarState
export const selectSidebarStateTimeout = (state: RootState): boolean =>
  state.menu.sidebarStateTimeout
