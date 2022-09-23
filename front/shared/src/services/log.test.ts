import { log } from './log'

jest.mock('../services/fetch')
jest.mock('../services/storage')

describe('Log service', () => {
  describe('log', () => {
    it('should call the funtion passed in arguments', () => {
      const spy = jest.fn()
      log(new Error('error'), spy)
      expect(spy).toHaveBeenCalledWith('error')
    })
  })
})
