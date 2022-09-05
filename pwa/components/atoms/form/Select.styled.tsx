import { ForwardedRef, HTMLProps, forwardRef } from 'react'
import { selectUnstyledClasses } from '@mui/base/SelectUnstyled'
import PopperUnstyled from '@mui/base/PopperUnstyled'
import { styled } from '@mui/system'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'

function ButtonWithIcon(
  props: HTMLProps<HTMLButtonElement>,
  ref: ForwardedRef<HTMLButtonElement>
): JSX.Element {
  const { children } = props
  return (
    <button {...props} ref={ref} type="button">
      <span>{children}</span>
      <IonIcon name="chevron-down" />
    </button>
  )
}
const ButtonWithIconRef = forwardRef<HTMLButtonElement>(ButtonWithIcon)

export const StyledButton = styled(ButtonWithIconRef)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontFamily: 'Inter',
  padding: '10px 16px',
  background: theme.palette.colors.white,
  width: 180,
  height: 40,
  borderColor: theme.palette.colors.neutral['300'],
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: 8,
  fontWeight: 400,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.colors.neutral['600'],
  textAlign: 'left',
  transition: 'border-color 0.3s linear',
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& span': {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  '& ion-icon': {
    float: 'right',
    flexShrink: 0,
  },
  '&:hover': {
    borderColor: theme.palette.colors.neutral['400'],
  },
  '&:focus, &:focus-within': {
    borderColor: theme.palette.colors.neutral['600'],
  },
  '&.Mui-disabled': {
    borderColor: theme.palette.colors.neutral['300'],
    background: theme.palette.colors.neutral['300'],
    '& ion-icon': {
      color: theme.palette.colors.neutral['400'],
    },
  },

  [`&.${selectUnstyledClasses.focusVisible}`]: {
    outline: '3px solid pink',
  },

  [`&.${selectUnstyledClasses.expanded}`]: {
    borderColor: theme.palette.colors.neutral['600'],
    '& ion-icon': {
      transform: 'rotate(180deg)',
    },
  },
}))

export const SmallStyledButton = styled(StyledButton)(({ theme }) => ({
  height: '26px',
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  width: 'max-content',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: theme.palette.colors.neutral['900'],
  fontWeight: 600,
  fontFamily: 'Inter',
  lineHeight: '18px',
  borderRadius: '99px',
  fontSize: '12px',
}))

export const TransparentStyledButton = styled(StyledButton)(() => ({
  background: 'transparent',
  border: '0',
  '&.Mui-expanded': {
    backgroundColor: 'rgba(0, 0, 0, 0.075)',
  },
  '& > span': {
    fontWeight: 'normal',
  },
}))

export const SmallTransparentStyledButton = styled(SmallStyledButton)(() => ({
  background: 'transparent',
  border: '0',
  '&.Mui-expanded': {
    backgroundColor: 'rgba(0, 0, 0, 0.075)',
  },
  '& > span': {
    fontWeight: 'normal',
  },
}))

export const StyledListbox = styled('ul')(({ theme }) => ({
  position: 'relative',
  padding: 0,
  background: theme.palette.colors.white,
  width: 180,
  border: `1px solid ${theme.palette.colors.neutral['300']}`,
  borderRadius: 8,
  overflow: 'auto',
  boxSizing: 'border-box',
  margin: '4px 0',
  outline: 0,
}))

export const StyledPopper = styled(PopperUnstyled)(() => ({
  zIndex: 1,
}))
