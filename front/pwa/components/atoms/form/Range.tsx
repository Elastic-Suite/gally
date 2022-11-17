import { ChangeEvent, ReactNode, Ref, SyntheticEvent } from 'react'
import { FormHelperText, InputLabel } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { getFormValue } from '~/services'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'

import InfoTooltip from './InfoTooltip'
import {
  IUnstyledInputTextProps,
  StyledFormControl,
  Suffix,
  Wrapper,
} from './InputText.styled'
import { FirstInput, SecondInput } from './Range.styled'

export interface IRangeProps
  extends Omit<
    IUnstyledInputTextProps,
    'margin' | 'onChange' | 'placeholder' | 'value'
  > {
  error?: boolean
  fullWidth?: boolean
  infoTooltip?: string
  inputRef?: Ref<HTMLInputElement>
  helperText?: ReactNode
  helperIcon?: string
  label?: string
  margin?: 'none' | 'dense' | 'normal'
  placeholder?: string[]
  onChange?: (value: (string | number)[], event: SyntheticEvent) => void
  suffix?: ReactNode
  value: (string | number)[]
}

function Range(props: IRangeProps): JSX.Element {
  const { t } = useTranslation('common')
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
    placeholder,
    required,
    suffix,
    value,
    ...InputProps
  } = props
  const [placeholderFrom, placeholderTo] = placeholder
  const [valueFrom, valueTo] = value

  function handleChangeFrom(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { value } = event.target
    if (onChange) {
      onChange([getFormValue(value, props), valueTo], event)
    }
  }

  function handleChangeTo(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { value } = event.target
    if (onChange) {
      onChange([valueFrom, getFormValue(value, props)], event)
    }
  }

  return (
    <StyledFormControl fullWidth={fullWidth} margin={margin}>
      {Boolean(label || infoTooltip) && (
        <InputLabel shrink htmlFor={id} required={required}>
          {label}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      )}
      <Wrapper className="InputText__Wrapper">
        {t('form.from')}
        <FirstInput
          error={error}
          id={id}
          onChange={handleChangeFrom}
          required={required}
          {...InputProps}
          inputProps={{ ...inputProps, max: valueTo }}
          placeholder={placeholderFrom}
          value={String(valueFrom)}
        />
        {t('form.to')}
        <SecondInput
          error={error}
          onChange={handleChangeTo}
          required={required}
          {...InputProps}
          inputProps={{ ...inputProps, min: valueFrom }}
          placeholder={placeholderTo}
          value={String(valueTo)}
        />
        {Boolean(suffix) && <Suffix>{suffix}</Suffix>}
      </Wrapper>
      {Boolean(helperText) && (
        <FormHelperText error={error}>
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

Range.defaultProps = {
  margin: 'none',
  placeholder: [],
  type: 'number',
}

export default Range
