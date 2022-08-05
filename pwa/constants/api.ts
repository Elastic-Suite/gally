let url =
  process.env.NODE_ENV === 'test'
    ? 'http://localhost/'
    : process.env.NEXT_PUBLIC_API_URL ??
      (typeof window !== 'undefined' ? window.location.origin : '')
if (url && String(url).endsWith('/')) {
  url = url.slice(0, -1)
}
export const apiUrl = url

// URL parameters
export const currentPage = 'currentPage'
export const pageSize = 'pageSize'
export const usePagination = 'pagination'
export const searchParameter = 'search'

export const defaultPageSize = 50
