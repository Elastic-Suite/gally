import { getFormValue } from './form'

describe('Form service', () => {
  describe('getFormValue', () => {
    it('Should get the form value with casting', () => {
      expect(getFormValue('42', { type: 'text' })).toEqual('42')
      expect(getFormValue('42', { type: 'number' })).toEqual(42)
      expect(getFormValue('', { type: 'text' })).toEqual('')
      expect(getFormValue('', { type: 'number' })).toEqual('')
      expect(getFormValue('', { type: 'text', required: true })).toEqual('')
      expect(getFormValue('', { type: 'number', required: true })).toEqual(0)
    })
  })
})
