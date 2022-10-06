import { SyntheticEvent, useCallback, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { getFormValidityError } from 'shared'

export type IOnChange = (value: unknown, event: SyntheticEvent) => void

export interface IFormErrorProps {
  error: boolean
  helperIcon: string
  helperText: string
  onChange: IOnChange
}

export function useFormError(onChange: IOnChange): IFormErrorProps {
  const [error, setError] = useState('')
  const { t } = useTranslation('common')

  const helperIcon = error ? 'close' : ''
  const helperText = error ? t(`formError.${error}`) : ''

  const validate = useCallback((event: SyntheticEvent): void => {
    const { validity } = event.target as HTMLInputElement
    if (!validity.valid) {
      setError(getFormValidityError(validity))
    } else {
      setError('')
    }
  }, [])

  const handleChange = useCallback(
    (value: unknown, event: SyntheticEvent): void => {
      validate(event)
      if (onChange) {
        onChange(value, event)
      }
    },
    [onChange, validate]
  )

  return {
    error: Boolean(error),
    helperIcon,
    helperText,
    onChange: handleChange,
  }
}
