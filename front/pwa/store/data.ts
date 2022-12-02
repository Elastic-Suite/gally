import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { IApi, IExtraBundle, IHydraResponse } from 'shared'

import { RootState } from './store'

export interface IDataState {
  api: IApi
  bundles: IHydraResponse<IExtraBundle>
}

const initialState: IDataState = {
  api: null,
  bundles: null,
}

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<IDataState>) {
      state.api = action.payload.api
      state.bundles = action.payload.bundles
    },
  },
})

export const { setData } = dataSlice.actions
export const dataReducer = dataSlice.reducer

export const selectApi = (state: RootState): IApi => state.data.api
export const selectBundles = (state: RootState): IHydraResponse<IExtraBundle> =>
  state.data.bundles
