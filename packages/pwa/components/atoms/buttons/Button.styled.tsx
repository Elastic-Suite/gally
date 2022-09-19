import { styled } from '@mui/system'
import { Button } from '@mui/material'

export const PrimaryButton = styled(Button)(({ theme }) => ({
  color: `${theme.palette.colors.white}`,
  lineHeight: '24px',
  textTransform: 'none',
  letterSpacing: '0.2px',
  fontWeight: 500,
  background: `${theme.palette.colors.gradient.default}`,
  boxShadow: `${theme.palette.colors.shadow.primaryButton.sm}`,
  borderRadius: '8px',
  marginLeft: theme.spacing(2),
  '&:first-of-type': {
    marginLeft: 0,
  },
  '&::before': {
    position: 'absolute',
    content: '""',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: '8px',
    background: `${theme.palette.colors.gradient.darken}`,
    boxShadow: `${theme.palette.colors.shadow.primaryButton.md}`,
    zIndex: -1,
    transition: 'opacity 0.3s linear',
    opacity: 0,
  },
  '&:hover::before': {
    opacity: 1,
  },
  '&.MuiButton-sizeSmall': {
    fontSize: '12px',
    padding: '4px 12px',
  },
  '&.MuiButton-sizeMedium': {
    fontSize: '14px',
    padding: '8px 16px',
  },
  '&.MuiButton-sizeLarge': {
    fontSize: '16px',
    padding: '12px 24px',
  },
  '&:hover': {
    background: `${theme.palette.colors.gradient.default}`,
    boxShadow: `${theme.palette.colors.shadow.primaryButton.sm}`,
  },
  '&& .MuiTouchRipple-child': {
    backgroundColor: `${theme.palette.colors.primary['600']}`,
  },
  '&& .MuiTouchRipple-rippleVisible': {
    animationName: '$buttonEnterKeyframe',
    animationDuration: '500ms',
  },
  '&.Mui-disabled': {
    color: `${theme.palette.colors.neutral['500']}`,
    background: `${theme.palette.colors.neutral['300']}`,
    boxShadow: 'none',
  },
}))

export const SecondaryButton = styled(PrimaryButton)(({ theme }) => ({
  color: theme.palette.colors.secondary['600'],
  background: theme.palette.colors.secondary['100'],
  boxShadow: theme.palette.colors.shadow.secondaryButton.sm,
  '&::before': {
    background: theme.palette.colors.secondary['200'],
    boxShadow: theme.palette.colors.shadow.secondaryButton.md,
  },
  '&:hover': {
    background: theme.palette.colors.secondary['100'],
    boxShadow: theme.palette.colors.shadow.secondaryButton.sm,
  },
  '&& .MuiTouchRipple-child': {
    backgroundColor: theme.palette.colors.secondary['300'],
  },
}))

export const TertiaryButton = styled(PrimaryButton)(({ theme }) => ({
  color: theme.palette.colors.neutral['900'],
  background: 'none',
  boxShadow: 'none',
  '&::before': {
    background: theme.palette.colors.neutral['200'],
    boxShadow: 'none',
  },
  '&:hover': {
    background: 'none',
    boxShadow: 'none',
  },
  '&& .MuiTouchRipple-child': {
    backgroundColor: theme.palette.colors.neutral['300'],
  },
}))
