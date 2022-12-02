import { Role } from 'shared'

import { RootState } from './store'
import {
  IUserState,
  selectRequestedPath,
  selectToken,
  selectUser,
  setRequestedPath,
  setUser,
  userReducer,
} from './user'

const initialState: IUserState = {
  token: '',
  requestedPath: null,
  user: null,
}

describe('userReducer', () => {
  it('should return the initial state', () => {
    expect(userReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  it('should set the requested path', () => {
    expect(userReducer(initialState, setRequestedPath('/admin'))).toEqual(
      expect.objectContaining({
        requestedPath: '/admin',
      })
    )
  })

  it('should set the user and token', () => {
    expect(
      userReducer(
        initialState,
        setUser({
          token:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NTk5NTM1NDQsImV4cCI6MTY1OTk4MjM0NCwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfQ09OVFJJQlVUT1IiXSwidXNlcm5hbWUiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ZNE2SHmtm9WgWEMmKGMjpcfEym2ysxC_CVcLtzlpuT3jlT0Zyz4VjoQHdTav9I7s9b2QzpeDNt3Sfrbka8IHcVb_TvZle_vII-TkQGal37RtXxKk_EMMQQlzLRO3zDWYy2I0ZPXv6iMlaSWOya4egOG2s1_tzFf4MnNNm2zEQbjzAtZ_Ij9UBMlSxK19AHvHlKU9AelA-NepjUdl6f4GxYPnyIwZw3PS294Wtffj7Kzw1ZZywDljl1xN_flg70cuO0GGkUqBNHrf7zBjPmXbAZZDAefoyQfVqB2v4GzDJfO847XymvBlHtCCjWx0ThK5afyOGL2MAAZkl-AoNjMcjA',
          user: {
            iat: 1659953544,
            exp: 1659982344,
            roles: [Role.ADMIN, Role.CONTRIBUTOR],
            username: 'admin@example.com',
          },
        })
      )
    ).toEqual(
      expect.objectContaining({
        token:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NTk5NTM1NDQsImV4cCI6MTY1OTk4MjM0NCwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfQ09OVFJJQlVUT1IiXSwidXNlcm5hbWUiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ZNE2SHmtm9WgWEMmKGMjpcfEym2ysxC_CVcLtzlpuT3jlT0Zyz4VjoQHdTav9I7s9b2QzpeDNt3Sfrbka8IHcVb_TvZle_vII-TkQGal37RtXxKk_EMMQQlzLRO3zDWYy2I0ZPXv6iMlaSWOya4egOG2s1_tzFf4MnNNm2zEQbjzAtZ_Ij9UBMlSxK19AHvHlKU9AelA-NepjUdl6f4GxYPnyIwZw3PS294Wtffj7Kzw1ZZywDljl1xN_flg70cuO0GGkUqBNHrf7zBjPmXbAZZDAefoyQfVqB2v4GzDJfO847XymvBlHtCCjWx0ThK5afyOGL2MAAZkl-AoNjMcjA',
        user: {
          iat: 1659953544,
          exp: 1659982344,
          roles: [Role.ADMIN, Role.CONTRIBUTOR],
          username: 'admin@example.com',
        },
      })
    )
  })

  it('Should select the requested path', () => {
    const rootState = {
      user: {
        requestedPath: '/admin',
      },
    } as unknown as RootState
    expect(selectRequestedPath(rootState)).toEqual('/admin')
  })

  it('Should select the token', () => {
    const rootState = {
      user: {
        token: '123',
      },
    } as unknown as RootState
    expect(selectToken(rootState)).toEqual('123')
  })

  it('Should select the user', () => {
    const rootState = {
      user: {
        user: {
          iat: 1659953544,
          exp: 1659982344,
          roles: [Role.ADMIN, Role.CONTRIBUTOR],
          username: 'admin@example.com',
        },
      },
    } as unknown as RootState
    expect(selectUser(rootState)).toEqual({
      iat: 1659953544,
      exp: 1659982344,
      roles: [Role.ADMIN, Role.CONTRIBUTOR],
      username: 'admin@example.com',
    })
  })
})
