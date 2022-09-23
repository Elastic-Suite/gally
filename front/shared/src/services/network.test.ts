import { isError } from './network'

jest.mock('../services/storage')

describe('Network service', () => {
  describe('isError', () => {
    it('should check if response is a fetch error', () => {
      expect(isError({ error: 'Unauthorized' })).toEqual(true)
      expect(isError({ hello: 'world' })).toEqual(false)
    })
  })
})
