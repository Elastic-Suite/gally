import { IError } from '../types'

export class AuthError extends Error {}

export function isError<T>(json: T | IError): json is IError {
  return 'error' in json
}
