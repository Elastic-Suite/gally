import {
  firstLetterLowercase,
  firstLetterUppercase,
  formatPrice,
  getFieldLabelTranslationArgs,
  getNameFromDefault,
  humanize,
} from './format'

describe('Format service', () => {
  describe('firstLetterUppercase', () => {
    it('Should set first letter to uppercase', () => {
      expect(firstLetterUppercase('hello there')).toEqual('Hello there')
    })
  })

  describe('firstLetterLowercase', () => {
    it('Should set first letter to lowercase', () => {
      expect(firstLetterLowercase('Hello there')).toEqual('hello there')
    })
  })

  describe('getNameFromDefault', () => {
    it('Should get the name without the default part', () => {
      expect(getNameFromDefault('defaultMaxSize')).toEqual('maxSize')
    })
  })

  describe('humanize', () => {
    it('Should humanize the label', () => {
      expect(humanize('defaultLabel')).toEqual('Default label')
    })
  })

  describe('getFieldLabelTranslationArgs', () => {
    it('Should return field label (args for translation)', () => {
      expect(getFieldLabelTranslationArgs('defaultLabel')).toEqual([
        'fields.defaultLabel',
        'Default label',
      ])
      expect(getFieldLabelTranslationArgs('defaultLabel', 'metadata')).toEqual([
        'resources.metadata.fields.defaultLabel',
        'Default label',
      ])
    })
  })

  describe('formatPrice', () => {
    it('Should format price', () => {
      expect(formatPrice(100, 'USD', 'fr-FR')).toContain('100,00')
      expect(formatPrice(100, 'USD', 'fr-FR')).toContain('$US')
    })
  })
})
