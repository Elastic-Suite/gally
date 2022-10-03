import { useCallback } from 'react'
import { MessageSeverity, NetworkError, log } from 'shared'

import { addMessage, useAppDispatch } from '~/store'

export function useLog(
  severity: MessageSeverity = 'error'
): (error: NetworkError) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (error: NetworkError) =>
      log(error, (message: string) =>
        dispatch(addMessage({ message, severity }))
      ),
    [dispatch, severity]
  )
}
