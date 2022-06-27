import { MouseEvent, ReactChild } from 'react'
import IonIcon, { IIonIconProps } from '~/components/atoms/IonIcon/IonIcon'
import { styled } from '@mui/system'

export interface IProps {
  children: ReactChild
  onIconClick?: (event: MouseEvent<IIonIconProps>) => void
  color?: string
}

const Tag = ({ children, onIconClick, color = 'neutral' }: IProps) => {
  return (
    <TagContainer className={'tag--color__' + color}>
      <span className="tag--label">{children}</span>
      {onIconClick ? (
        <IonIcon name="close" class={'tag--icon'} onClick={onIconClick} />
      ) : (
        ''
      )}
    </TagContainer>
  )
}

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
  '& .tag--icon': {
    cursor: 'pointer',
    fontSize: 16,
    marginLeft: theme.spacing(0.5),
  },
}))

export default Tag
