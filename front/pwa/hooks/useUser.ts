import { useMemo } from 'react'

import { IUser, getUser, storageGet, tokenStorageKey } from 'shared'

import { useLog } from './useLog'

export function useUser(): IUser {
  const log = useLog()
  const token = storageGet(tokenStorageKey)
  return useMemo(() => {
    try {
      if (token) {
        return getUser(token)
      }
    } catch (error) {
      log(error)
    }
    return null
  }, [log, token])
}
