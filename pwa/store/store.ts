import { configureStore } from '@reduxjs/toolkit'
import { apiReducer } from './api'
import { i18nReducer } from './i18n'
import { menuReducer } from './menu'

export const store = configureStore({
  reducer: {
    api: apiReducer,
    i18n: i18nReducer,
    menu: menuReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export interface IThunkApi {
  dispatch: AppDispatch
  state: RootState
}
