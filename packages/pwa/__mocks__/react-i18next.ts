export interface ITranslation {
  i18n: {
    language: string
  }
  t: (key: string) => string
}

const translation = {
  i18n: {
    language: 'en',
  },
  t: (key: string): string => key,
}

export function useTranslation(): ITranslation {
  return translation
}
