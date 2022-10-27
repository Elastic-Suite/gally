import {
  ChangeEvent,
  ForwardedRef,
  ReactNode,
  Ref,
  SyntheticEvent,
  forwardRef,
} from 'react'
import { FormHelperText, InputLabel } from '@mui/material'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'

import InfoTooltip from './InfoTooltip'
import {
  IUnstyledInputTextProps,
  InputTextStyled,
  StyledFormControl,
  Suffix,
  Wrapper,
} from './InputText.styled'

export interface IInputTextProps
  extends Omit<IUnstyledInputTextProps, 'margin' | 'onChange'> {
  error?: boolean
  fullWidth?: boolean
  infoTooltip?: string
  inputRef?: Ref<HTMLInputElement>
  label?: string
  margin?: 'none' | 'dense' | 'normal'
  helperText?: ReactNode
  helperIcon?: string
  onChange?: (value: string | number, event: SyntheticEvent) => void
  suffix?: ReactNode
}

function InputText(
  props: IInputTextProps,
  ref: ForwardedRef<HTMLDivElement>
): JSX.Element {
  const {
    error,
    fullWidth,
    helperText,
    helperIcon,
    id,
    infoTooltip,
    inputProps,
    label,
    margin,
    onChange,
    required,
    suffix,
    ...InputProps
  } = props
  const { type } = InputProps

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { value } = event.target
    if (onChange) {
      if (type === 'number') {
        onChange(!required && value === '' ? value : Number(value), event)
      } else {
        onChange(value, event)
      }
    }
  }

  return (
    <StyledFormControl
      error={error}
      fullWidth={fullWidth}
      margin={margin}
      variant="standard"
    >
      {Boolean(label || infoTooltip) && (
        <InputLabel shrink htmlFor={id} required={required}>
          {label}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      )}
      <Wrapper className="InputText__Wrapper">
        <InputTextStyled
          id={id}
          onChange={handleChange}
          required={required}
          ref={ref}
          {...InputProps}
          inputProps={inputProps}
        />
        {Boolean(suffix) && <Suffix>{suffix}</Suffix>}
      </Wrapper>
      {Boolean(helperText) && (
        <FormHelperText>
          {Boolean(helperIcon) && (
            <IonIcon
              name={helperIcon}
              style={{ fontSize: 18, marginRight: 2 }}
            />
          )}
          {helperText}
        </FormHelperText>
      )}
    </StyledFormControl>
  )
}

export default forwardRef<HTMLDivElement, IInputTextProps>(InputText)
