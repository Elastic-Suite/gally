import {
  clearParameters,
  getAppUrl,
  getListApiParameters,
  getListParameters,
  getPageParameter,
  getParametersFromUrl,
  getRouterPath,
  getRouterUrl,
  getSearchParameter,
  getUrl,
} from './url'

describe('URL service', () => {
  describe('getUrl', () => {
    it('should return an URL object from an string', () => {
      const url = getUrl('http://localhost/test')
      expect(url.href).toEqual('http://localhost/test')
    })

    it('should return an URL object from an URL object', () => {
      const url = getUrl(new URL('http://localhost/test'))
      expect(url.href).toEqual('http://localhost/test')
    })

    it('should return an URL object with parameters', () => {
      const url = getUrl('http://localhost/test', { foo: 'bar' })
      expect(url.href).toEqual('http://localhost/test?foo=bar')
    })

    it('should return an URL object with array parameters', () => {
      const url = getUrl('http://localhost/test', { 'foo[]': ['bar', 'baz'] })
      expect(url.href).toEqual(
        'http://localhost/test?foo%5B%5D=bar&foo%5B%5D=baz'
      )
    })
  })

  describe('clearParameters', () => {
    it('should clear URL parameters', () => {
      const url = new URL('http://localhost/?foo=bar')
      expect(clearParameters(url).href).toEqual('http://localhost/')
    })
  })

  describe('getListParameters', () => {
    it('should get list parameters with default values', () => {
      expect(getListParameters()).toEqual({})
    })

    it('should get list parameters with pagination', () => {
      expect(getListParameters(1, { foo: 'bar' }, 'baz')).toEqual({
        currentPage: 1,
        foo: 'bar',
        search: 'baz',
      })
    })

    it('should get list parameters without pagination', () => {
      expect(getListParameters(false, { foo: 'bar' }, 'baz')).toEqual({
        foo: 'bar',
        search: 'baz',
      })
    })
  })

  describe('getListApiParameters', () => {
    it('should get API list parameters with default values', () => {
      expect(getListApiParameters()).toEqual({
        currentPage: 1,
        pagination: true,
        pageSize: 50,
      })
    })

    it('should get API list parameters with pagination', () => {
      expect(getListApiParameters(1, 10, { foo: 'bar' }, 'baz')).toEqual({
        currentPage: 2,
        pagination: true,
        pageSize: 10,
        foo: 'bar',
        search: 'baz',
      })
    })

    it('should get API list parameters without pagination', () => {
      expect(
        getListApiParameters(false, undefined, { foo: 'bar' }, 'baz')
      ).toEqual({
        pagination: false,
        foo: 'bar',
        search: 'baz',
      })
    })
  })

  describe('getRouterUrl', () => {
    it('should get absolute URL from router path', () => {
      const url = getRouterUrl('/test')
      expect(url.href).toEqual('http://localhost/test')
    })
  })

  describe('getRouterPath', () => {
    it('should get the router path without parameters', () => {
      expect(getRouterPath('/test?foo=bar')).toEqual('/test')
    })
  })

  describe('getAppUrl', () => {
    it('should get the app URL with default parameters', () => {
      const url = getAppUrl('/test')
      expect(url.href).toEqual('http://localhost/test')
    })

    it('should get the app URL with parameters', () => {
      const url = getAppUrl('/test', 1, { foo: 'bar' }, 'baz')
      expect(url.href).toEqual(
        'http://localhost/test?foo=bar&currentPage=1&search=baz'
      )
    })
  })

  describe('getParametersFromUrl', () => {
    it('should get the parameters from an URL', () => {
      const url = new URL(
        'http://localhost/test?currentPage=1&foo=bar&search=baz'
      )
      expect(getParametersFromUrl(url)).toEqual({
        currentPage: '1',
        foo: 'bar',
        search: 'baz',
      })
    })

    it('should get the array parameters from an URL', () => {
      const url = new URL('http://localhost/test?foo[]=bar&foo[]=baz')
      expect(getParametersFromUrl(url)).toEqual({
        'foo[]': ['bar', 'baz'],
      })
    })
  })

  describe('getPageParameter', () => {
    it('should get the page parameter', () => {
      expect(
        getPageParameter({
          currentPage: '1',
          foo: 'bar',
          search: 'baz',
        })
      ).toEqual(1)
    })

    it('should return the default page', () => {
      expect(getPageParameter({})).toEqual(0)
    })
  })

  describe('getSearchParameter', () => {
    it('should get the page parameter', () => {
      expect(
        getSearchParameter({
          currentPage: '1',
          foo: 'bar',
          search: 'baz',
        })
      ).toEqual('baz')
    })

    it('should return the default page', () => {
      expect(getSearchParameter({})).toEqual('')
    })
  })
})
