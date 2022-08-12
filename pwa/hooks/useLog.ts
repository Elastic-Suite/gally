import { useCallback } from 'react'

import { NetworkError, log } from '~/services'
import { addMessage, useAppDispatch } from '~/store'

export function useLog(): (error: NetworkError) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (error: NetworkError) =>
      log((message: string) => dispatch(addMessage(message)), error),
    [dispatch]
  )
}
