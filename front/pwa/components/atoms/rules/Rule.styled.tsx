import { styled } from '@mui/system'

export const Root = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  background: theme.palette.colors.neutral['200'],
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  width: 'fit-content',
  border: '1px solid',
  borderColor: theme.palette.colors.neutral['300'],
  borderRadius: theme.spacing(1),
  alignItems: 'center',
  gap: theme.spacing(0.5),
}))

export const Close = styled('div')(({ theme }) => ({
  display: 'flex',
  cursor: 'pointer',
  transition: 'all 500ms',
  padding: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  color: theme.palette.colors.neutral['600'],
  '&:hover': {
    background: theme.palette.colors.neutral['300'],
  },
}))

export const CustomCombination = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  fontFamily: 'Inter',
  color: theme.palette.colors.neutral['900'],
  fontWeight: 400,
  lineHeight: '18px',
  fontSize: '12px',
  width: 'max-content',
}))
