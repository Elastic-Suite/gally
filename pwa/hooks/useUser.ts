import { useMemo } from 'react'
import jwtDecode from 'jwt-decode'

import { tokenStorageKey } from '~/constants'
import { storageGet } from '~/services'
import { IUser } from '~/types'

export function useUser(): IUser {
  const token = storageGet(tokenStorageKey)
  return useMemo(() => (token ? (jwtDecode(token) as IUser) : null), [token])
}
