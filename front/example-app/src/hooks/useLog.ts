import { useCallback } from 'react'
import { NetworkError, log } from 'gally-admin-shared'

export function useLog(): (error: NetworkError) => void {
  return useCallback((error: NetworkError) => log(error), [])
}
