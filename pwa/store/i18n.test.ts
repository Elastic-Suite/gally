import { II18nState, i18nReducer, setLanguage } from './i18n'

const initialState: II18nState = {
  language: 'en',
}

describe('i18nReducer', () => {
  it('should return the initial state', () => {
    expect(i18nReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  it('should set the language', () => {
    expect(i18nReducer(initialState, setLanguage('fr'))).toEqual({
      language: 'fr',
    })
  })
})
