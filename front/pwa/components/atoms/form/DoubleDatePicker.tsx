import { ReactNode } from 'react'
import { Box, FormHelperText, Grid, InputLabel } from '@mui/material'
import { DateValidationError } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation'
import { useTranslation } from 'next-i18next'
import { styled } from '@mui/system'
import { Dayjs } from 'dayjs'

import IonIcon from '../IonIcon/IonIcon'

import DatePicker, { IDatePickerProps } from './DatePicker'
import { StyledFormControl } from './InputText.styled'
import InfoTooltip from './InfoTooltip'

const CustomBox = styled(Box)(() => ({
  fontWeight: 400,
  fontFamily: 'inter',
}))

export interface IDoubleDatePickerValues {
  from: Dayjs | null
  to: Dayjs | null
}
export interface IDoubleDatePickerErrors {
  from: DateValidationError
  to: DateValidationError
}

export interface IDoubleDatePickerProps
  extends Omit<IDatePickerProps, 'value' | 'onChange' | 'onError'> {
  value?: IDoubleDatePickerValues
  onChange?: (values: IDoubleDatePickerValues) => void
  onError?: (reasons: IDoubleDatePickerErrors) => void
  error?: boolean
  errors?: IDoubleDatePickerErrors
  fullWidth?: boolean
  infoTooltip?: string
  label?: ReactNode
  margin?: 'none' | 'dense' | 'normal'
  helperText?: ReactNode
  helperIcon?: string
}

function DoubleDatePicker(props: IDoubleDatePickerProps): JSX.Element {
  const {
    value,
    error,
    errors,
    fullWidth,
    helperText,
    helperIcon,
    id,
    infoTooltip,
    inputProps,
    label,
    margin,
    onChange,
    onError,
    required,
    ...args
  } = props
  const { t } = useTranslation('common')

  function onChangeFrom(date: Dayjs | null): void {
    onChange({ ...value, from: date })
  }

  function onChangeTo(date: Dayjs | null): void {
    onChange({ ...value, to: date })
  }

  function onErrorFrom(reason: DateValidationError): void {
    onError({ ...errors, from: reason })
  }

  function onErrorTo(reason: DateValidationError): void {
    onError({ ...errors, to: reason })
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
      <Grid
        justifyContent="flex-start"
        alignItems="center"
        container
        sx={{ marginTop: label ? '24px' : '0px' }}
      >
        <CustomBox sx={{ paddingRight: '20px' }}> {t('form.from')} </CustomBox>
        <Grid item xs>
          <DatePicker
            {...args}
            error={error}
            fullWidth={fullWidth}
            value={value?.from}
            onChange={onChangeFrom}
            onError={onErrorFrom}
          />
        </Grid>
        <CustomBox sx={{ paddingRight: '20px', paddingLeft: '20px' }}>
          {' '}
          {t('form.to')}{' '}
        </CustomBox>
        <Grid item xs>
          <DatePicker
            {...args}
            error={error}
            fullWidth={fullWidth}
            value={value?.to}
            onChange={onChangeTo}
            onError={onErrorTo}
          />
        </Grid>
      </Grid>
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

export default DoubleDatePicker
