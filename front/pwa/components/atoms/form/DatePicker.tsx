import { DatePicker as DatePickerMu } from '@mui/x-date-pickers/DatePicker'

import dayjs, { Dayjs } from 'dayjs'
import {
  PickersDay,
  PickersDayProps,
  pickersDayClasses,
} from '@mui/x-date-pickers/PickersDay'
import isBetweenPlugin from 'dayjs/plugin/isBetween'
import { styled } from '@mui/system'
import { ComponentType } from 'react'
import InputText, { IInputTextProps } from './InputText'

dayjs.extend(isBetweenPlugin)

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

interface IDatePickerProps extends IInputTextProps {
  date: Dayjs | null
  onDate: (value: Dayjs | null) => void
}

function DatePicker({ date, onDate, ...args }: IDatePickerProps): JSX.Element {
  const renderWeekPickerDay = (
    _: Dayjs,
    __: Array<Dayjs | null>,
    pickersDayProps: PickersDayProps<Dayjs>
  ): JSX.Element => {
    return <CustomPickersDay {...pickersDayProps} />
  }

  return (
    <DatePickerMu
      value={date}
      onChange={(newValue): void => {
        onDate(newValue)
      }}
      renderDay={renderWeekPickerDay}
      renderInput={(params): JSX.Element =>  <InputText  {...params} {...args} endAdornment={params.InputProps.endAdornment} /> }
    />
  )
}

export default DatePicker