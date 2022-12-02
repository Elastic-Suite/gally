import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { IUser } from 'shared'

import { RootState } from './store'

export interface IUserState {
  token: string
  requestedPath: string
  user: IUser
}

const initialState: IUserState = {
  token: '',
  requestedPath: null,
  user: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setRequestedPath(state, action: PayloadAction<string>) {
      state.requestedPath = action.payload
    },
    setUser(state, action: PayloadAction<{ token: string; user: IUser }>) {
      state.token = action.payload.token
      state.user = action.payload.user
    },
  },
})

export const { setRequestedPath, setUser } = userSlice.actions
export const userReducer = userSlice.reducer

export const selectToken = (state: RootState): string => state.user.token
export const selectRequestedPath = (state: RootState): string =>
  state.user.requestedPath
export const selectUser = (state: RootState): IUser => state.user.user
