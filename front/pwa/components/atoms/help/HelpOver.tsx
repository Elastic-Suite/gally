import { styled } from '@mui/system'
import { useRouter } from 'next/router'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingRight: theme.spacing(1.5),
  paddingLeft: theme.spacing(1.5),
  color: theme.palette.colors.neutral['800'],
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '12px',
  fontFamily: 'Inter',
  lineHeight: '18px',
}))

const CustomDiv = styled('div')({
  ':hover': { cursor: 'pointer' },
})

function HelpOver(): JSX.Element {
  const router = useRouter()

  function handleRouter(url: string): void {
    router.push(url)
  }

  return (
    <CustomRoot>
      <CustomDiv onClick={(): void => handleRouter('/helpdesk')}>
        Helpdesk
      </CustomDiv>
      <CustomDiv onClick={(): void => handleRouter('/userGuide')}>
        User guide
      </CustomDiv>
      {process.env.NODE_ENV === 'development' && (
        <CustomDiv onClick={(): void => handleRouter('/swagger/docs')}>
          API documentation
        </CustomDiv>
      )}
    </CustomRoot>
  )
}

export default HelpOver
