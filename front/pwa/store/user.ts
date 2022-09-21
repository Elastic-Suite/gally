import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'

export interface IUserState {
  requestedPath: string
}

const initialState: IUserState = {
  requestedPath: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setRequestedPath(state, action: PayloadAction<string>) {
      state.requestedPath = action.payload
    },
  },
})

export const { setRequestedPath } = userSlice.actions
export const userReducer = userSlice.reducer

export const selectRequestedPath = (state: RootState): string =>
  state.user.requestedPath
