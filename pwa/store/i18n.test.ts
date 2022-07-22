import { i18nReducer, setLanguage } from './i18n'

describe('i18nReducer', () => {
  it('should return the initial state', () => {
    expect(i18nReducer(undefined, { type: undefined })).toEqual({
      language: 'en',
    })
  })

  it('should set the language', () => {
    const previousState = {
      language: 'en',
    }

    expect(i18nReducer(previousState, setLanguage('fr'))).toEqual({
      language: 'fr',
    })
  })
})
