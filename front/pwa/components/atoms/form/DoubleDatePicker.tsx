
import { Box, Grid } from '@mui/material'
import { Dayjs } from 'dayjs'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { styled } from '@mui/system'
import DatePicker from './DatePicker'

const CustomBox = styled(Box)(() => ({
    fontWeight: 400,
    fontFamily: 'inter'
 }))

 interface IDatePickerProps {
    value?: {from: Dayjs | null, to: Dayjs | null} | null
    onChange?: (value: {from: Dayjs | null, to: Dayjs | null}) => void
  }

function DoubleDatePicker({value, onChange}: IDatePickerProps): JSX.Element {

    const [dateFrom, setDateFrom] = useState<Dayjs | null>(null)
    const [dateFrom2, setDateFrom2] = useState<Dayjs | null>(null)
    const { t } = useTranslation('datePicker')

    function onChangeDate(date: Dayjs | null): void {
      setDateFrom(date)
      onChange({...value, from: date})
    }

    function onChangeDate2(date: Dayjs | null): void {
        setDateFrom2(date)
        onChange({...value, to: date})
      }
    const args =  {
        color: 'primary',
        disabled: false,
        id: 'input-text',
        transparent: false,
      }
  
  return (
    <Grid justifyContent='flex-start' alignItems='center' container sx={{width: '900px'}}>
        <CustomBox sx={{paddingRight: '20px'}}> {t('from')} </CustomBox>
        <Grid item sx={{width: '190px'}}>
            <DatePicker {...args} value={dateFrom} onChange={onChangeDate} />
        </Grid>
        <CustomBox sx={{paddingRight: '20px', paddingLeft: '20px'}}> {t('to')} </CustomBox>
        <Grid item sx={{width: '190px'}}>
            <DatePicker {...args} value={dateFrom2} onChange={onChangeDate2} />
        </Grid>
    </Grid>
  )
}

export default DoubleDatePicker