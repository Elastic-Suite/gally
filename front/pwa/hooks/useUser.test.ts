import { Role, storageGet } from 'shared'

import { renderHookWithProviders } from '~/utils/tests'

import { useUser } from './useUser'

const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NTk5NTM1NDQsImV4cCI6MTY1OTk4MjM0NCwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfQ09OVFJJQlVUT1IiXSwidXNlcm5hbWUiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ZNE2SHmtm9WgWEMmKGMjpcfEym2ysxC_CVcLtzlpuT3jlT0Zyz4VjoQHdTav9I7s9b2QzpeDNt3Sfrbka8IHcVb_TvZle_vII-TkQGal37RtXxKk_EMMQQlzLRO3zDWYy2I0ZPXv6iMlaSWOya4egOG2s1_tzFf4MnNNm2zEQbjzAtZ_Ij9UBMlSxK19AHvHlKU9AelA-NepjUdl6f4GxYPnyIwZw3PS294Wtffj7Kzw1ZZywDljl1xN_flg70cuO0GGkUqBNHrf7zBjPmXbAZZDAefoyQfVqB2v4GzDJfO847XymvBlHtCCjWx0ThK5afyOGL2MAAZkl-AoNjMcjA'
const user = {
  iat: 1659953544,
  exp: 1659982344,
  roles: [Role.ADMIN, Role.CONTRIBUTOR],
  username: 'admin@example.com',
}

describe('useUser', () => {
  it('should update the store with the user when connected', () => {
    const mock = storageGet as jest.Mock
    mock.mockClear()
    mock.mockImplementationOnce(() => token)
    const { store } = renderHookWithProviders(() => useUser(), {
      preloadedState: {
        user: {
          requestedPath: '',
          token: '',
          user: null,
        },
      },
    })
    const state = store.getState()
    expect(state.user.user).toEqual(user)
  })

  it('should clear the user state if token is corrupted', () => {
    const mock = storageGet as jest.Mock
    mock.mockClear()
    mock.mockImplementationOnce(() => '123')
    const { store } = renderHookWithProviders(() => useUser(), {
      preloadedState: {
        user: {
          requestedPath: '',
          token,
          user,
        },
      },
    })
    const state = store.getState()
    expect(state.user.user).toEqual(null)
  })
})
