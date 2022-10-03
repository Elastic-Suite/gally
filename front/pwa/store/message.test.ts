import { RootState } from './store'
import {
  IMessageState,
  addMessage,
  messageReducer,
  removeMessage,
  selectMessages,
} from './message'

const initialState: IMessageState = {
  lastId: 0,
  messages: [],
}

describe('messageReducer', () => {
  it('should return the initial state', () => {
    expect(messageReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  it('should add a message', () => {
    expect(
      messageReducer(initialState, addMessage({ message: 'Hello world' }))
    ).toEqual({
      lastId: 1,
      messages: [{ id: 0, message: 'Hello world' }],
    })
  })

  it('should remove a message', () => {
    expect(
      messageReducer(
        {
          lastId: 1,
          messages: [{ id: 0, message: 'Hello world' }],
        },
        removeMessage(0)
      )
    ).toEqual({
      lastId: 1,
      messages: [],
    })
  })

  it('Should select the messages', () => {
    const rootState = {
      message: {
        lastId: 1,
        messages: [{ id: 0, message: 'Hello world' }],
      },
    } as unknown as RootState
    expect(selectMessages(rootState)).toEqual([
      { id: 0, message: 'Hello world' },
    ])
  })
})
