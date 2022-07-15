import { styled } from '@mui/material/styles'

const CustomRoot = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  background: theme.palette.colors.white,
  border: '1px solid #E2E6F3',
  borderRadius: 8,
}))

interface IProps {
  content: string[]
}

function ActiveLocales({ content }: IProps): JSX.Element {
  return (
    <CustomRoot>
      {content.map((item: string) => (
        <div key={item}>{item}</div>
      ))}
    </CustomRoot>
  )
}

export default ActiveLocales
