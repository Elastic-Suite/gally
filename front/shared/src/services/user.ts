import jwtDecode from 'jwt-decode'

import { IUser } from '../types'

export function isValidUser(user?: IUser): boolean {
  return Boolean(user && Date.now() / 1000 < user.exp)
}

export function getUser(token?: string): IUser {
  return jwtDecode(token) as IUser
}
