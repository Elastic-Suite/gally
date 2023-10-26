import { FormControl, styled } from '@mui/material'

export const Container = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const SelectFormControl = styled(FormControl)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  minWidth: '200px',
}))

export const CustomResultPagination = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontFamily: 'Inter',
  color: theme.palette.common.black,
}))
