import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'

import { Dayjs } from 'dayjs'
import {
  PickersDay,
  PickersDayProps,
  pickersDayClasses,
} from '@mui/x-date-pickers/PickersDay'
import { styled } from '@mui/system'
import { ComponentType } from 'react'
import InputText, { IInputTextProps } from './InputText'

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})<PickersDayProps<Dayjs>>(({ theme }) => ({
  fontWeight: 500,
  [`&&.${pickersDayClasses.selected}`]: {
    backgroundColor: theme.palette.colors.primary['400'],
    color: 'white',
  },
  [`&&.${pickersDayClasses.selected}, &:hover, &:focus`]: {
    backgroundColor: theme.palette.colors.primary['400'],
    color: 'white',
  },
})) as ComponentType<PickersDayProps<Dayjs>>

interface IDatePickerProps {
  value: Dayjs | null
  onChange: (value: Dayjs | null) => void
  args: IInputTextProps
}

function DatePicker({ value, onChange, ...args }: IDatePickerProps): JSX.Element {
  const renderWeekPickerDay = (
    _: Dayjs,
    __: Array<Dayjs | null>,
    pickersDayProps: PickersDayProps<Dayjs>
  ): JSX.Element => {
    return <CustomPickersDay {...pickersDayProps} />
  }

  return (
    <MuiDatePicker
      value={value}
      onChange={(newValue): void => {
        onChange(newValue)
      }}
      renderDay={renderWeekPickerDay}
      renderInput={(params): JSX.Element =>  <InputText  {...params} {...args} endAdornment={params.InputProps.endAdornment} /> }
    />
  )
}

export default DatePicker