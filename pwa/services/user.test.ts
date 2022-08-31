import { isValidUser } from './user'

describe('User service', () => {
  describe('isValidUser', () => {
    it('should not validate the user', () => {
      expect(isValidUser()).toEqual(false)
      expect(
        isValidUser({
          exp: Date.now() / 1000 - 100,
          iat: 42,
          roles: [],
          username: 'batman',
        })
      ).toEqual(false)
    })

    it('should validate the user', () => {
      expect(
        isValidUser({
          exp: Date.now() / 1000 + 100,
          iat: 42,
          roles: [],
          username: 'batman',
        })
      ).toEqual(true)
    })
  })
})
