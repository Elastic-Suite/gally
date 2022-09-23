import { NetworkError } from '../types'

export function log(
  error: NetworkError,
  log?: (message: string) => void
): void {
  if (
    process.env.NODE_ENV === 'development' ||
    (typeof window !== 'undefined' && window.showErrors === true)
  ) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
  if (log) {
    log(typeof error === 'string' ? error : error.message)
  }
}
