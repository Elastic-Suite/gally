import { Grid, styled } from '@mui/material'

export const SearchTitle = styled(Grid)(() => ({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '16px',
  lineHeight: '24px',
  color: '#151A47',
}))

export const SearchResult = styled(Grid)(({ theme }) => ({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '12px',
  lineHeight: '18px',
  color: '#424880',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

export const CustomNoTopProduct = styled('div')(({ theme }) => ({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '12px',
  lineHeight: '18px',
  color: theme.palette.colors.primary['500'],
}))
