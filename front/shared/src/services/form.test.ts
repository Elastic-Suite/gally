import { getFormValidityError } from './form'

describe('Form service', () => {
  describe('getFormValidityError', () => {
    it('Should return the error from ValidityState object', () => {
      expect(
        getFormValidityError({
          badInput: false,
          customError: false,
          patternMismatch: false,
          rangeOverflow: true,
          rangeUnderflow: false,
          stepMismatch: false,
          tooLong: false,
          tooShort: false,
          typeMismatch: false,
          valid: false,
          valueMissing: false,
        })
      ).toEqual('rangeOverflow')
    })
  })
})
