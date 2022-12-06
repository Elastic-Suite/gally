import { styled } from '@mui/system'
import Link from 'next/link'

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

const CustomA = styled('a')({
  textDecoration: 'none',
})

function HelpOver(): JSX.Element {
  return (
    <CustomRoot>
      <Link
        href="https://elasticsuite.zendesk.com"
        passHref
        style={{ textDecoration: 'none!important', color: 'red' }}
      >
        <CustomA>Helpdesk</CustomA>
      </Link>

      <Link href="https://elastic-suite.github.io/documentation/" passHref>
        <CustomA>User guide</CustomA>
      </Link>

      {process.env.NODE_ENV === 'development' && (
        <Link href="/swagger/docs" passHref>
          <CustomA>API documentation</CustomA>
        </Link>
      )}
    </CustomRoot>
  )
}

export default HelpOver
