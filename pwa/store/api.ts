import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchApi } from '~/services/api'
import { IDocsJson, IDocsJsonld, IFetch, LoadStatus } from '~/types'

import { IThunkApi, RootState } from './store'

export interface IDocs {
  json: IDocsJson
  jsonld: IDocsJsonld
}

export interface IApiState {
  docs: IFetch<IDocs>
}

const initialState: IApiState = {
  docs: {
    data: {
      json: null,
      jsonld: null,
    },
    error: null,
    status: LoadStatus.IDLE,
  },
}

export const fetchDocs = createAsyncThunk<IDocs, void, IThunkApi>(
  'api/docs.jsonld',
  async (_, { getState }) => {
    const {
      i18n: { language },
    } = getState()
    const results = await Promise.all([
      fetchApi(language, '/docs.json').then((response) => response.json()),
      fetchApi(language, '/docs.jsonld').then((response) => response.json()),
    ])
    return { json: results[0], jsonld: results[0] }
  }
)

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDocs.pending, (state) => {
        state.docs.status = LoadStatus.LOADING
      })
      .addCase(fetchDocs.fulfilled, (state, action) => {
        state.docs.status = LoadStatus.SUCCEEDED
        state.docs.data = action.payload
      })
      .addCase(fetchDocs.rejected, (state, action) => {
        state.docs.status = LoadStatus.FAILED
        state.docs.error = action.error.message
      })
  },
})

// export const { } = apiSlice.actions
export const apiReducer = apiSlice.reducer

export const selectDocs = (state: RootState) => state.api.docs
