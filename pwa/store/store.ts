import { configureStore } from '@reduxjs/toolkit'
import { apiReducer } from './api'
import { menuReducer } from './menu'

export const store = configureStore({
  reducer: {
    api: apiReducer,
    menu: menuReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
