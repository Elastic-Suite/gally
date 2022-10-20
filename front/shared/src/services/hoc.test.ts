import { getDisplayName } from './hoc'

describe('HOC service', () => {
  describe('getDisplayName', () => {
    it('Should return the component name', () => {
      function MyCmp(): JSX.Element {
        return null
      }
      expect(getDisplayName(MyCmp)).toEqual('MyCmp')
    })
  })
})
