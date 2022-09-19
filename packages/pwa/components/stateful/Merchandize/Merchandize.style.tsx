import { styled } from '@mui/system'
import { Box, Grid } from '@mui/material'

export const Font = styled(Box)(() => ({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  color: '#151A47',
  flex: 'none',
  order: 0,
  flexGrow: 0,
}))

export const FontRequired = styled(Grid)(() => ({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '18px',
  color: '#424880',
  flex: 'none',
  order: 0,
  flexGrow: 0,
}))
