import { MouseEvent, ReactChild } from 'react'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import { styled } from '@mui/system'

const TagContainer = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  color: theme.palette.colors.neutral['900'],
  fontFamily: 'Inter',
  fontWeight: 600,
  fontSize: 12,
  lineHeight: '18px',
  textAlign: 'center',
  alignItems: 'center',
  padding: '4px 12px',
  background: theme.palette.colors.neutral['300'],
  borderRadius: 99,
  cursor: 'default',
  '&.tag--color__secondary': {
    color: theme.palette.colors.secondary['600'],
    background: theme.palette.colors.secondary['100'],
  },
  '&.tag--color__success': {
    color: theme.palette.success.main,
    background: theme.palette.success.light,
  },
  '&.tag--color__error': {
    color: theme.palette.error.main,
    background: theme.palette.error.light,
  },
}))

const Button = styled('button')(({ theme }) => ({
  cursor: 'pointer',
  fontSize: 16,
  marginLeft: theme.spacing(0.5),
  borderRadius: '50%',
  padding: 0,
  border: 0,
  backgroundColor: 'transparent',
  display: 'flex',
}))

export interface IProps {
  children: ReactChild
  onIconClick?: (event: MouseEvent<HTMLButtonElement>) => void
  color?: string
}

function Tag({ children, onIconClick, color }: IProps): JSX.Element {
  return (
    <TagContainer className={`tag--color__${color}`}>
      <span className="tag--label">{children}</span>
      {onIconClick ? (
        <Button onClick={onIconClick}>
          <IonIcon name="close" />
        </Button>
      ) : null}
    </TagContainer>
  )
}

export default Tag
