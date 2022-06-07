import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Jsonld, LoadStatus } from '~/types'

export interface jsonldFetch {
  data: Jsonld,
  error: string,
  status: LoadStatus,
}

export interface ApiState {
  jsonld: jsonldFetch
}

const initialState: ApiState = {
  jsonld: {
    data: null,
    error: null,
    status: LoadStatus.IDLE,
  },
}

export const fetchJsonld = createAsyncThunk('api/docs.jsonld', async () => {
  const response = await fetch('docs.jsonld')
  const json = await response.json()
  return json
})

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchJsonld.pending, (state) => {
        state.jsonld.status = LoadStatus.LOADING
      })
      .addCase(fetchJsonld.fulfilled, (state, action) => {
        state.jsonld.status = LoadStatus.SUCCESSDED
        state.jsonld.data = action.payload
      })
      .addCase(fetchJsonld.rejected, (state, action) => {
        state.jsonld.status = LoadStatus.FAILED
        state.jsonld.error = action.error.message
      })
  }
})

// export const {} = apiSlice.actions
export const apiReducer = apiSlice.reducer

export const selectJsonld = (state) => state.api.jsonld
