import { log } from 'gally-admin-shared'

import { renderHookWithProviders } from '../utils/tests'

import { useLog } from './useLog'

describe('useLog', () => {
  it('should return the log function prefilled', () => {
    ;(log as unknown as jest.Mock).mockClear()
    const { result } = renderHookWithProviders(() => useLog())
    result.current(new Error('error'))
    expect(log).toHaveBeenCalledWith(new Error('error'))
  })
})
