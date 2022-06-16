import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { DocsJson, DocsJsonld, LoadStatus } from '~/types'

export interface docsFetch {
  json: DocsJson
  jsonld: DocsJsonld
  error: string
  status: LoadStatus
}

export interface ApiState {
  docs: docsFetch
}

const initialState: ApiState = {
  docs: {
    json: null,
    jsonld: null,
    error: null,
    status: LoadStatus.IDLE,
  },
}

export const fetchDocs = createAsyncThunk('api/docs.jsonld', async () => {
  const results = await Promise.all([
    fetch('/docs.json').then((response) => response.json()),
    fetch('/docs.jsonld').then((response) => response.json()),
  ])
  return results
})

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
        state.docs.status = LoadStatus.SUCCESSDED
        state.docs.json = action.payload[0]
        state.docs.jsonld = action.payload[1]
      })
      .addCase(fetchDocs.rejected, (state, action) => {
        state.docs.status = LoadStatus.FAILED
        state.docs.error = action.error.message
      })
  },
})

// export const {} = apiSlice.actions
export const apiReducer = apiSlice.reducer

export const selectDocs = (state) => state.api.docs
