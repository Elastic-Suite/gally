import {
  PreloadedState,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { dataReducer } from './data'
import { i18nReducer } from './i18n'
import { menuReducer } from './menu'
import { userReducer } from './user'

const rootReducer = combineReducers({
  data: dataReducer,
  i18n: i18nReducer,
  menu: menuReducer,
  user: userReducer,
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    middleware: (getDefaultMiddleware) =>
      process.env.NODE_ENV === 'development'
        ? getDefaultMiddleware({
            serializableCheck: {
              ignoredActionPaths: ['payload.error'],
              ignoredPaths: ['menu.menu.error'],
            },
          })
        : [thunk],
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
