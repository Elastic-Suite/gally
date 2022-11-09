import { act } from '@testing-library/react'
import { enqueueSnackbar } from 'notistack'

import { renderHookWithProviders } from '~/utils/tests'

import { useLog } from './useLog'

describe('useLog', () => {
  it('should open a notification', () => {
    const { result } = renderHookWithProviders(() => useLog())
    act(() => result.current(new Error('error')))
    expect(enqueueSnackbar).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({
        variant: 'error',
      })
    )
  })
})
