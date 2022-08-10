export function storageGet(key: string): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key)
  }
}

export function storageSet(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value)
  }
}

export function storageRemove(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key)
  }
}
