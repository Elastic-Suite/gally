import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Api, parseHydraDocumentation } from '@api-platform/api-doc-parser'

import { getApiUrl } from '~/services'
import { IFetch, LoadStatus } from '~/types'

import { IThunkApi, RootState } from './store'

export interface IApiState {
  doc: IFetch<Api>
}

const initialState: IApiState = {
  doc: {
    data: null,
    error: null,
    status: LoadStatus.IDLE,
  },
}

export const fetchDoc = createAsyncThunk<Api, void, IThunkApi>(
  'api/doc',
  async () => {
    const { api } = await parseHydraDocumentation(getApiUrl())
    return api
  }
)

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDoc.pending, (state) => {
        state.doc.status = LoadStatus.LOADING
      })
      .addCase(fetchDoc.fulfilled, (state, action) => {
        state.doc.status = LoadStatus.SUCCEEDED
        state.doc.data = action.payload
      })
      .addCase(fetchDoc.rejected, (state, action) => {
        state.doc.status = LoadStatus.FAILED
        state.doc.error = action.error.message
      })
  },
})

// export const { } = apiSlice.actions
export const apiReducer = apiSlice.reducer

export const selectDoc = (state: RootState): IFetch<Api> => state.api.doc
