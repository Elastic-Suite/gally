import { SyntheticEvent, useCallback, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { getFormValidityError } from 'shared'

export type IOnChange = (value: unknown, event?: SyntheticEvent) => void
export type IValidator = (
  value: unknown,
  event?: SyntheticEvent
) => string | null

export interface IFormErrorProps {
  error: boolean
  helperIcon?: string
  helperText?: string
  onChange: IOnChange
}

export function useFormError(
  onChange: IOnChange,
  showError = false,
  validator?: IValidator
): IFormErrorProps {
  const [error, setError] = useState('')
  const { t } = useTranslation('common')

  const helperIcon = error ? 'close' : undefined
  const helperText = error ? t(`formError.${error}`) : undefined

  const validate = useCallback(
    (value: unknown, event?: SyntheticEvent): boolean => {
      let error = null
      if (validator) {
        error = validator(value, event)
      }
      if (error === null && event) {
        const { validity } = event.target as HTMLInputElement
        if (!validity.valid) {
          error = getFormValidityError(validity)
        }
      }
      if (error && showError) {
        setError(error)
      } else {
        setError('')
      }
      return error === null
    },
    [showError, validator]
  )

  const handleChange = useCallback(
    (value: unknown, event?: SyntheticEvent): void => {
      const isValid = validate(value, event)
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
