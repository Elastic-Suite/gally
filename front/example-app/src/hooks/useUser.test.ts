import { act } from '@testing-library/react'
import { getUser, storageGet } from 'gally-admin-shared'

import { renderHookWithProviders } from '../utils/tests'

import { useUser } from './useUser'

describe('useUser', () => {
  it('should return null when not connected', () => {
    const { result } = renderHookWithProviders(() => useUser())
    expect(result.current).toEqual([null, expect.any(Function)])
    expect(getUser).not.toHaveBeenCalled()
  })

  it('should return the user when connected', () => {
    const mock = storageGet as jest.Mock
    mock.mockClear()
    mock.mockImplementationOnce(() => 'token')
    renderHookWithProviders(() => useUser())
    expect(getUser).toHaveBeenCalled()
  })

  it('should update the token', () => {
    const { result } = renderHookWithProviders(() => useUser())
    act(() =>
      result.current[1](
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NTk5NTM1NDQsImV4cCI6MTY1OTk4MjM0NCwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfQ09OVFJJQlVUT1IiXSwidXNlcm5hbWUiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ZNE2SHmtm9WgWEMmKGMjpcfEym2ysxC_CVcLtzlpuT3jlT0Zyz4VjoQHdTav9I7s9b2QzpeDNt3Sfrbka8IHcVb_TvZle_vII-TkQGal37RtXxKk_EMMQQlzLRO3zDWYy2I0ZPXv6iMlaSWOya4egOG2s1_tzFf4MnNNm2zEQbjzAtZ_Ij9UBMlSxK19AHvHlKU9AelA-NepjUdl6f4GxYPnyIwZw3PS294Wtffj7Kzw1ZZywDljl1xN_flg70cuO0GGkUqBNHrf7zBjPmXbAZZDAefoyQfVqB2v4GzDJfO847XymvBlHtCCjWx0ThK5afyOGL2MAAZkl-AoNjMcjA'
      )
    )
    expect(getUser).toHaveBeenCalled()
  })
})
