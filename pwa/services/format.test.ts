import { firstLetterUppercase } from './format'

it('Should set first letter to uppercase', () => {
  const text = 'hello there'
  expect(firstLetterUppercase(text)).toEqual('Hello there')
})
