import { theme } from '../constants'

import { getCustomScrollBarStyles } from './style'

describe('Style service', () => {
  describe('getCustomScrollBarStyles', () => {
    it('should get styles', () => {
      expect(getCustomScrollBarStyles(theme)).toEqual(expect.any(Object))
    })
  })
})
