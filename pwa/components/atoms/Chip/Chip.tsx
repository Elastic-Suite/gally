import { HTMLAttributes, SyntheticEvent } from 'react'
import { styled } from '@mui/system'
import { IconButton } from '@mui/material'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'

const BadgeContainer = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  height: '26px',
  color: theme.palette.colors.neutral['900'],
  fontFamily: 'Inter',
  fontWeight: 600,
  fontSize: 12,
  lineHeight: '18px',
  textAlign: 'center',
  alignItems: 'center',
  padding: `2px ${theme.spacing(1)}`,
  margin: '2px',
  background: theme.palette.colors.neutral['300'],
  borderRadius: '13px',
  cursor: 'default',
  boxSizing: 'border-box',
  '&.badge--color__primary': {
    color: theme.palette.colors.secondary['600'],
    background: theme.palette.colors.secondary['100'],
  },
  '&.badge--color__success': {
    color: theme.palette.success.main,
    background: theme.palette.success.light,
  },
  '&.badge--color__warning': {
    color: theme.palette.warning.main,
    background: theme.palette.warning.light,
  },
  '&.badge--color__error': {
    color: theme.palette.error.main,
    background: theme.palette.error.light,
  },
  '& .MuiButtonBase-root': {
    color: 'inherit',
    margin: `0 0 0 ${theme.spacing(0.5)}`,
    padding: 0,
    fontSize: '14px',
    '&:hover': {
      color: 'inherit',
      opacity: 0.5,
    },
  },
}))

interface IProps extends HTMLAttributes<HTMLSpanElement> {
  color?: 'neutral' | 'primary' | 'success' | 'warning' | 'error'
  label: string
  onDelete?: (event: SyntheticEvent) => void
  small?: boolean
}

function Badge(props: IProps): JSX.Element {
  const { color, label, onDelete, small } = props
  return (
    <BadgeContainer
      className={`badge--color__${color}`}
      style={small ? { height: '20px' } : null}
    >
      <span className="badge--label">{label}</span>
      {onDelete ? (
        <IconButton onClick={onDelete}>
          <IonIcon name="close" />
        </IconButton>
      ) : null}
    </BadgeContainer>
  )
}

Badge.defaultProps = {
  color: 'neutral',
}

export default Badge
