import { useCallback } from 'react'

import { NetworkError, log } from 'shared'
import { addMessage, useAppDispatch } from '~/store'

export function useLog(): (error: NetworkError) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (error: NetworkError) =>
      log(error, (message: string) => dispatch(addMessage(message))),
    [dispatch]
  )
}
