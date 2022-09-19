import { RootState } from './store'
import {
  IUserState,
  selectRequestedPath,
  setRequestedPath,
  userReducer,
} from './user'

const initialState: IUserState = {
  requestedPath: null,
}

describe('userReducer', () => {
  it('should return the initial state', () => {
    expect(userReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  it('should set the requested path', () => {
    expect(userReducer(initialState, setRequestedPath('/admin'))).toEqual({
      requestedPath: '/admin',
    })
  })

  it('Should select requested path', () => {
    const rootState = {
      user: {
        requestedPath: '/admin',
      },
    } as unknown as RootState
    expect(selectRequestedPath(rootState)).toEqual('/admin')
  })
})
