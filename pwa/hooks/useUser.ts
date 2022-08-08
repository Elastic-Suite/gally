import { useMemo } from 'react'
import jwtDecode from 'jwt-decode'

import { tokenStorageKey } from '~/constants'
import { storageGet } from '~/services'
import { IUser } from '~/types'

export function useUser(): IUser {
  const token = storageGet(tokenStorageKey)
  return useMemo(() => {
    try {
      if (token) {
        return jwtDecode(token) as IUser
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
    return null
  }, [token])
}
