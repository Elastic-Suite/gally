import { ReactNode } from 'react'
import { Box, FormHelperText, Grid, InputLabel } from '@mui/material'
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

interface IProps extends Omit<IDatePickerProps, 'value' | 'onChange'> {
  value?: { from: Dayjs | null; to: Dayjs | null } | null
  onChange?: (value: { from: Dayjs | null; to: Dayjs | null }) => void
  error?: boolean
  fullWidth?: boolean
  infoTooltip?: string
  label?: ReactNode
  margin?: 'none' | 'dense' | 'normal'
  helperText?: ReactNode
  helperIcon?: string
}

function DoubleDatePicker(props: IProps): JSX.Element {
  const {
    value,
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
    ...args
  } = props

  const { t } = useTranslation('common')

  function onChangeFrom(date: Dayjs | null): void {
    onChange({ ...value, from: date })
  }

  function onChangeTo(date: Dayjs | null): void {
    onChange({ ...value, to: date })
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
        sx={{ width: '900px', marginTop: label ? '30px' : '0px' }}
      >
        <CustomBox sx={{ paddingRight: '20px' }}> {t('form.from')} </CustomBox>
        <Grid item sx={{ width: '190px' }}>
          <DatePicker {...args} value={value.from} onChange={onChangeFrom} />
        </Grid>
        <CustomBox sx={{ paddingRight: '20px', paddingLeft: '20px' }}>
          {' '}
          {t('form.to')}{' '}
        </CustomBox>
        <Grid item sx={{ width: '190px' }}>
          <DatePicker {...args} value={value.to} onChange={onChangeTo} />
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
