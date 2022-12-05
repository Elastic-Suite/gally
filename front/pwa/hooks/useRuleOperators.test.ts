import { waitFor } from '@testing-library/react'
import { fetchApi, isVirtualCategoryEnabled } from 'shared'

import { renderHookWithProviders } from '~/utils/tests'

import { useRuleOperators } from './useRuleOperators'

describe('useRuleOperators', () => {
  it('should load the rule operators', async () => {
    ;(fetchApi as jest.Mock).mockClear()
    const { result } = renderHookWithProviders(() => useRuleOperators())
    await waitFor(() => expect(result.current).toEqual(expect.any(Object)))
    expect(fetchApi).toHaveBeenCalled()
  })

  it('should not load the rule operators if virtual category bundle is not enabled', () => {
    ;(fetchApi as jest.Mock).mockClear()
    ;(isVirtualCategoryEnabled as jest.Mock).mockImplementationOnce(() => false)
    renderHookWithProviders(() => useRuleOperators())
    expect(fetchApi).not.toHaveBeenCalled()
  })
})
