import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

const useCommonButtonStyle = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.colors.white,
    lineHeight: '24px',
    textTransform: 'capitalize',
    letterSpacing: '0.2px',
    fontWeight: 500,
    background: theme.palette.colors.gradient.default,
    boxShadow: theme.palette.colors.shadow.primaryButton.sm,
    borderRadius: '8px',
    zIndex: 1,
    '&::before': {
      position: 'absolute',
      content: '""',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: '8px',
      background: theme.palette.colors.gradient.darken,
      boxShadow: theme.palette.colors.shadow.primaryButton.md,
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
      background: theme.palette.colors.gradient.default,
      boxShadow: theme.palette.colors.shadow.primaryButton.sm,
    },
    '&& .MuiTouchRipple-child': {
      backgroundColor: theme.palette.colors.primary['600'],
    },
    '&& .MuiTouchRipple-rippleVisible': {
      animationName: '$buttonEnterKeyframe',
      animationDuration: '500ms',
    },
    '&.Mui-disabled': {
      color: theme.palette.colors.neutral['500'],
      background: theme.palette.colors.neutral['300'],
      boxShadow: 'none',
    },
  },
  '@keyframes buttonEnterKeyframe': {
    '0%': {
      transform: 'scale(0)',
      opacity: 0.3,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 0.6,
    },
  },
}))

export default useCommonButtonStyle
