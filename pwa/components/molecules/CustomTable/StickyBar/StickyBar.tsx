import { Box, styled } from '@mui/system'

const StickyContainer = styled(Box)({
  display: 'flex',
  position: 'sticky',
  bottom: '15px',
  background:
    'linear-gradient(0deg, rgba(21, 26, 71, 0.1) 0%, rgba(21, 26, 71, 0) 110.27%)',
  zIndex: '2',
  height: '112px',
  width: '100%',
})

const StickyActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.colors.white,
  height: '64px',
  width: '100%',
  margin: '32px 16px 16px 16px',
  border: 'solid',
  borderColor: theme.palette.colors.neutral[300],
  borderWidth: '1px',
  boxShadow:
    '0px -8px 8px rgba(226, 230, 243, 0.2), 0px 8px 8px rgba(107, 113, 166, 0.2), 4px 4px 14px rgba(226, 230, 243, 0.5)',
  borderRadius: '8px',
}))

interface IProps {
  show: boolean
  children: JSX.Element
}

function StickyBar(props: IProps): JSX.Element {
  const { show, children } = props

  if (!show) {
    return null
  }

  return (
    <StickyContainer data-testid="sticky-bar">
      <StickyActions>{children}</StickyActions>
    </StickyContainer>
  )
}

export default StickyBar
