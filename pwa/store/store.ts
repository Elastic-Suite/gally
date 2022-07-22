import {
  PreloadedState,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit'
import { apiReducer } from './api'
import { i18nReducer } from './i18n'
import { menuReducer } from './menu'

const rootReducer = combineReducers({
  api: apiReducer,
  i18n: i18nReducer,
  menu: menuReducer,
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['api/doc'],
          ignoredActionPaths: ['payload'],
          ignoredPaths: ['api.doc.data'],
        },
      }),
    preloadedState,
    reducer: rootReducer,
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

export interface IThunkApi {
  dispatch: AppDispatch
  state: RootState
}
