export function fetchApi(): Promise<{ hello: string }> {
  return Promise.resolve({ hello: 'world' })
}
