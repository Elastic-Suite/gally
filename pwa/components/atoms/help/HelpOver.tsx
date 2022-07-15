import { styled } from '@mui/system'

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

function HelpOver(): JSX.Element {
  return (
    <CustomRoot>
      <div>Helpdesk</div>
      <div>User guide</div>
    </CustomRoot>
  )
}

export default HelpOver
