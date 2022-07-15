import { ReactChild } from 'react'
import { styled } from '@mui/system'

interface IProps {
  children: ReactChild
  color?: string
}

function Badge({ children, color = 'secondary' }: IProps): JSX.Element {
  return (
    <BadgeContainer className={`badge--color__${color}`}>
      <span className="badge--label">{children}</span>
    </BadgeContainer>
  )
}

const BadgeContainer = styled('span')(({ theme }) => ({
  display: 'inline-block',
  color: theme.palette.colors.secondary['600'],
  fontFamily: 'Inter',
  fontWeight: 600,
  fontSize: 12,
  lineHeight: '18px',
  textAlign: 'center',
  alignItems: 'center',
  padding: '2px 8px',
  background: theme.palette.colors.secondary['100'],
  borderRadius: 99,
  cursor: 'default',
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
}))

export default Badge
