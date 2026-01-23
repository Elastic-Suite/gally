import path from 'node:path'

export function getTestFilePath(relativePath: string): string {
  // Remove leading slash from relative path if present
  const normalizedPath = relativePath.startsWith('/')
    ? relativePath.substring(1)
    : relativePath

  // path.join automatically handles duplicate slashes and normalizes the path
  return path.join(__dirname, '../files', normalizedPath)
}
