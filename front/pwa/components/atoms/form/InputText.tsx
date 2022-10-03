import {
  ChangeEvent,
  ForwardedRef,
  ReactNode,
  forwardRef,
  useState,
} from 'react'
import { FormHelperText, InputLabel } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { getFormValidityError } from 'shared'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'

import InfoTooltip from './InfoTooltip'
import {
  IUnstyledInputTextProps,
  InputTextStyled,
  StyledFormControl,
  Sufix,
  Wrapper,
} from './InputText.styled'

export interface IInputTextProps
  extends Omit<IUnstyledInputTextProps, 'onChange'> {
  fullWidth?: boolean
  infoTooltip?: string
  label?: string
  helperText?: ReactNode
  helperIcon?: string
  onChange?: (value: string | number) => void
  sufix?: ReactNode
  withMargin?: boolean
}

function InputText(
  props: IInputTextProps,
  ref: ForwardedRef<HTMLDivElement>
): JSX.Element {
  const {
    fullWidth,
    id,
    infoTooltip,
    inputProps,
    label,
    onChange,
    required,
    sufix,
    withMargin,
    ...other
  } = props
  const { type } = props
  // eslint-disable-next-line prefer-const
  let { helperText, helperIcon, ...InputProps } = other
  const { t } = useTranslation('common')

  const [error, setError] = useState('')
  if (error) {
    helperText ||= t(`formError.${error}`)
    helperIcon ||= 'close'
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { validity, value } = event.target
    if (!validity.valid) {
      setError(getFormValidityError(validity))
    } else {
      setError('')
    }
    if (onChange) {
      onChange(
        type === 'number' ? Number(value) : value
      )
    }
  }

  return (
    <StyledFormControl
      error={Boolean(error)}
      fullWidth={fullWidth}
      sx={{ marginBottom: withMargin ? 4 : 0 }}
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
        {Boolean(sufix) && <Sufix>{sufix}</Sufix>}
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
