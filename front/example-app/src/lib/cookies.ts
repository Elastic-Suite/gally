export function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

/** Omit `days` for a session cookie (cleared when the browser session ends). */
export function setCookie(name: string, value: string, days?: number): void {
  const expires = days
    ? `; expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}`
    : ''
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; samesite=lax`
}
