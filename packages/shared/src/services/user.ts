import { IUser } from '../types'

export function isValidUser(user?: IUser): boolean {
  return Boolean(user && Date.now() / 1000 < user.exp)
}
