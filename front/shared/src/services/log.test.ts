/* eslint-disable no-console */
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

    it('should log the error if showErrors is true', () => {
      window.showErrors = true
      jest.spyOn(console, 'error')
      ;(console.error as jest.Mock).mockImplementation((x) => x)
      log(new Error('error'))
      expect(console.error).toHaveBeenCalledWith(new Error('error'))
      ;(console.error as jest.Mock).mockRestore()
      window.showErrors = false
    })
  })
})
