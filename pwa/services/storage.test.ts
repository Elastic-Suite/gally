import { storageGet, storageRemove, storageSet } from './storage'

describe('Storage service', () => {
  describe('storageGet', () => {
    it('should get the storage value', () => {
      jest.spyOn(Storage.prototype, 'getItem')
      storageGet('test')
      expect(localStorage.getItem).toHaveBeenCalledWith('test')
      ;(localStorage.getItem as jest.Mock).mockRestore()
    })
  })

  describe('storageSet', () => {
    it('should set the storage value', () => {
      jest.spyOn(Storage.prototype, 'setItem')
      storageSet('test', 'foo')
      expect(localStorage.setItem).toHaveBeenCalledWith('test', 'foo')
      ;(localStorage.setItem as jest.Mock).mockRestore()
    })
  })

  describe('storageRemove', () => {
    it('should clear the storage value', () => {
      jest.spyOn(Storage.prototype, 'removeItem')
      storageRemove('test')
      expect(localStorage.removeItem).toHaveBeenCalledWith('test')
      ;(localStorage.removeItem as jest.Mock).mockRestore()
    })
  })
})
