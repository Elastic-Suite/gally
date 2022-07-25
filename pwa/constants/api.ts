let url = process.env.NEXT_PUBLIC_API_URL ?? ''
if (url && String(url).endsWith('/')) {
  url = url.slice(0, -1)
}
export const apiUrl = url

export const currentPage = 'currentPage'
export const pageSize = 'pageSize'
export const usePagination = 'pagination'

export const defaultPageSize = 50
