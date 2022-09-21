let url =
  process.env.NODE_ENV === 'test'
    ? 'http://localhost/'
    : process.env.NEXT_PUBLIC_API_URL ??
      process.env.REACT_APP_API_URL ??
      (typeof window !== 'undefined' ? window.location.origin : '')
if (url && String(url).endsWith('/')) {
  url = url.slice(0, -1)
}
export const apiUrl = url
export const gqlUrl = `${url}/graphql`
export const searchableAttributeUrl = '?isSearchable=true'

export const authHeader = 'Authorization'
export const languageHeader = 'Elasticsuite-Language'
export const contentTypeHeader = 'Content-Type'

export const authErrorCodes = [401, 403]

// URL parameters
export const currentPage = 'currentPage'
export const pageSize = 'pageSize'
export const usePagination = 'pagination'
export const searchParameter = 'search'

export const defaultPageSize = 50
