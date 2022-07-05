import { styled } from '@mui/material/styles'

const CustomRoot = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  background: theme.palette.colors.neutral[0],
  border: '1px solid #E2E6F3',
  borderRadius: 8,
}))

interface IProps {
  content: Array<string>
}

const ActiveLocales = ({ content }: IProps) => {
  return (
    <CustomRoot>
      {content.map((item: any, key: number) => (
        <div key={key}>{item}</div>
      ))}
    </CustomRoot>
  )
}

export default ActiveLocales
