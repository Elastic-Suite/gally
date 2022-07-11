import { styled } from '@mui/system'

const CustomRoot = styled('h1')(({ theme }) => ({
  marginTop: '70px',
  marginBottom: '60px',
  marginLeft: '0',
  marginRight: '0',
  fontSize: '36px',
  fontWeight: '600',
  lineHeight: '44px',
  fontFamily: 'Inter',
  color: theme.palette.colors.neutral['900'],
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-14px',
    left: '0px',
    borderRadius: 8,
    background: theme.palette.colors.primary['400'],
    width: '56px',
    height: '4px',
  },
}))

interface IProps {
  name: string
}

export function Title({ name }: IProps): JSX.Element {
  return <CustomRoot>{name}</CustomRoot>
}
