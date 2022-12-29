import { useCallback, useMemo, useState } from 'react'
import { IUser, getUser, storageGet, storageSet, tokenStorageKey } from 'gally-admin-shared'

import { useLog } from './useLog'

export function useUser(): [IUser, (token: string) => void] {
  const [token, setToken] = useState(storageGet(tokenStorageKey))
  const log = useLog()

  const updateToken = useCallback((token: string) => {
    storageSet(tokenStorageKey, token)
    setToken(token)
  }, [])

  return useMemo(() => {
    try {
      if (token) {
        return [getUser(token), updateToken]
      }
    } catch (error) {
      log(error)
    }
    return [null, updateToken]
  }, [log, token, updateToken])
}
