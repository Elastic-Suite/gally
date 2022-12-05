import { Bundle } from '../types'

import { isVirtualCategoryEnabled } from './bundle'

describe('bundle service', () => {
  describe('isVirtualCategoryEnabled', () => {
    it('should test if VirtualCategory bundle is enabled', () => {
      expect(isVirtualCategoryEnabled([])).toEqual(false)
      expect(isVirtualCategoryEnabled([Bundle.VIRTUAL_CATEGORY])).toEqual(true)
    })
  })
})
