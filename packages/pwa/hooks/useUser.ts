import { useMemo } from 'react'
import jwtDecode from 'jwt-decode'

import { IUser, storageGet, tokenStorageKey } from 'shared'

import { useLog } from './useLog'

export function useUser(): IUser {
  const log = useLog()
  const token = storageGet(tokenStorageKey)
  return useMemo(() => {
    try {
      if (token) {
        return jwtDecode(token) as IUser
      }
    } catch (error) {
      log(error)
    }
    return null
  }, [log, token])
}
