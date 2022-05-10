import RegularTheme, { buttonEnterKeyframe } from '~/components/atoms/RegularTheme'

const CommonButtonStyle = {
  color: RegularTheme.palette.colors.white,
  lineHeight: '24px',
  textTransform: 'capitalize',
  letterSpacing: '0.2px',
  fontWeight: 500,
  background: RegularTheme.palette.colors.gradient.default,
  boxShadow: RegularTheme.palette.colors.shadow.primaryButton.sm,
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
    background: RegularTheme.palette.colors.gradient.darken,
    boxShadow: RegularTheme.palette.colors.shadow.primaryButton.md,
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
    background: RegularTheme.palette.colors.gradient.default,
    boxShadow: RegularTheme.palette.colors.shadow.primaryButton.sm,
  },
  '&& .MuiTouchRipple-child': {
    backgroundColor: RegularTheme.palette.colors.primary['600'],
  },
  '&& .MuiTouchRipple-rippleVisible': {
    animationName: `${buttonEnterKeyframe}`,
     animationDuration: '500ms',
  },
  '&.Mui-disabled': {
    color: RegularTheme.palette.colors.neutral['500'],
    background: RegularTheme.palette.colors.neutral['300'],
    boxShadow: 'none',
  },
};

export default CommonButtonStyle
