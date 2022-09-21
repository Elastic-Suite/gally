import { styled } from '@mui/system'

const CustomTitleScope = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  lineHeight: '30px',
  fontSize: '20px',
  fontWeight: '600',
  fontFamily: 'Inter',
}))

interface IProps {
  name: string
}

function TitleScope({ name }: IProps): JSX.Element {
  return <CustomTitleScope>{name}</CustomTitleScope>
}

export default TitleScope
