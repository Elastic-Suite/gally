import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'next-i18next'
import { getFormValidityError } from 'gally-admin-shared'

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
): [IFormErrorProps, Dispatch<SetStateAction<string>>] {
  const [error, setError] = useState('')
  const { t } = useTranslation('common')

  const validate = useCallback(
    (value: unknown, event?: SyntheticEvent): boolean => {
      let error = null
      if (validator) {
        error = validator(value, event)
      }
      if (error === null && event?.target) {
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

  return useMemo(() => {
    const props: IFormErrorProps = {
      error: Boolean(error),
      onChange: handleChange,
    }
    if (error) {
      props.helperIcon = 'close'
      props.helperText = t(`formError.${error}`)
    }
    return [props, setError]
  }, [error, handleChange, t])
}
