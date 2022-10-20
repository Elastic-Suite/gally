import { ForwardedRef, forwardRef } from 'react'

import { useFormError } from '~/hooks'

import InputText, { IInputTextProps } from './InputText'

interface IInputTextErrorProps extends IInputTextProps {
  showError?: boolean
}

function InputTextError(
  props: IInputTextErrorProps,
  ref: ForwardedRef<HTMLDivElement>
): JSX.Element {
  const { onChange, showError, ...inputProps } = props
  const formErrorProps = useFormError(onChange, showError)
  return (
    <InputText
      {...inputProps}
      {...formErrorProps}
      helperIcon={formErrorProps.helperIcon ?? inputProps.helperIcon}
      helperText={formErrorProps.helperText ?? inputProps.helperText}
      ref={ref}
    />
  )
}

export default forwardRef(InputTextError)
