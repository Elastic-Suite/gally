import { SyntheticEvent, useCallback, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { getFormValidityError } from 'shared'

export type IOnChange = (value: unknown, event: SyntheticEvent) => void

export interface IFormErrorProps {
  error: boolean
  helperIcon?: string
  helperText?: string
  onChange: IOnChange
}

export function useFormError(
  onChange: IOnChange,
  showError = false
): IFormErrorProps {
  const [error, setError] = useState('')
  const { t } = useTranslation('common')

  const helperIcon = error ? 'close' : undefined
  const helperText = error ? t(`formError.${error}`) : undefined

  const validate = useCallback(
    (event: SyntheticEvent): boolean => {
      const { validity } = event.target as HTMLInputElement
      if (!validity.valid && showError) {
        setError(getFormValidityError(validity))
      } else {
        setError('')
      }
      return validity.valid
    },
    [showError]
  )

  const handleChange = useCallback(
    (value: unknown, event: SyntheticEvent): void => {
      const isValid = validate(event)
      if (onChange && (isValid || showError)) {
        onChange(value, event)
      }
    },
    [onChange, showError, validate]
  )

  return {
    error: Boolean(error),
    helperIcon,
    helperText,
    onChange: handleChange,
  }
}
