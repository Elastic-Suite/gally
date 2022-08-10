import { addMessage } from '~/store/message'
import { renderHookWithProviders } from '~/utils/tests'

import { useLog } from './useLog'

// jest.mock('~/store/hooks', () => ({ useAppDispatch: () => (x: any): any => x }))
jest.mock('~/store/message', () => ({
  addMessage: jest.fn((x) => ({ type: 'addMessage', payload: x })),
  messageReducer: (x: any = {}): any => x,
}))

describe('useLog', () => {
  it('should return the log function prefilled', () => {
    ;(addMessage as unknown as jest.Mock).mockClear()
    const { result } = renderHookWithProviders(() => useLog())
    result.current(new Error('error'))
    expect(addMessage).toHaveBeenCalledWith('error')
  })
})
