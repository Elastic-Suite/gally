import { ForwardedRef, forwardRef } from 'react'

import { useFormError } from '~/hooks'

import InputText, { IInputTextProps } from './InputText'

function InputTextError(
  props: IInputTextProps,
  ref: ForwardedRef<HTMLDivElement>
): JSX.Element {
  const { onChange, ...inputProps } = props
  const formErrorProps = useFormError(onChange)
  return <InputText {...formErrorProps} {...inputProps} ref={ref} />
}

export default forwardRef(InputTextError)
