export async function findAsync<T extends unknown>(
  array: T[],
  cb: (value: T) => Promise<boolean>
) {
  for (const element of array) {
    if (await cb(element)) {
      return element
    }
  }
}
