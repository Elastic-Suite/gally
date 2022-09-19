import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { IMessages } from 'shared'

import { RootState } from './store'

export interface IMessageState {
  lastId: number
  messages: IMessages
}

const initialState: IMessageState = {
  lastId: 0,
  messages: [],
}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<string>) {
      state.messages.push({ id: state.lastId++, message: action.payload })
    },
    removeMessage(state, action: PayloadAction<number>) {
      state.messages = state.messages.filter(({ id }) => id !== action.payload)
    },
  },
})

export const { addMessage, removeMessage } = messageSlice.actions
export const messageReducer = messageSlice.reducer

export const selectMessages = (state: RootState): IMessages =>
  state.message.messages
