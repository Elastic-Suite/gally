import { styled } from '@mui/system'

const LinkLabel = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral['900'],
  fontWeight: 600,
  fontSize: '12px',
  lineHeight: '18px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Inter',
  width: '32px',
  height: '26px',
  borderRadius: '28px',
  background: theme.palette.colors.primary['100'],
  border: '1px solid',
  borderColor: theme.palette.colors.primary['200'],
  position: 'relative',
  boxSizing: 'border-box',
}))

const LinkLabelSimple = styled(LinkLabel)(({ theme }) => ({
  '&:before': {
    content: '""',
    position: 'absolute',
    border: '1px dotted',
    borderColor: theme.palette.colors.neutral['500'],
    borderTop: 'none',
    borderRight: 'none',
    width: '22px',
    left: '50%',
    height: '42px',
    top: '100%',
  },
}))

const LinkLabelDouble = styled(LinkLabel)(({ theme }) => ({
  '&:before': {
    content: '""',
    position: 'absolute',
    border: '1px dotted',
    borderColor: theme.palette.colors.neutral['500'],
    borderBottom: 'none',
    borderRight: 'none',
    width: '22px',
    left: '50%',
    height: '12px',
    bottom: '100%',
  },

  '&:after': {
    content: '""',
    position: 'absolute',
    border: '1px dotted',
    borderColor: theme.palette.colors.neutral['500'],
    borderTop: 'none',
    borderRight: 'none',
    width: '22px',
    left: '50%',
    height: '12px',
    top: '100%',
  },
}))

const LinkLabelDoubleMerged = styled(LinkLabelDouble)(() => ({
  '&:before': {
    width: '0',
  },
}))

const DoubleLinkContainer = styled('div')(() => ({
  alignSelf: 'flex-end',
  transform: 'translateY(18px)',
}))

interface IProps {
  double?: boolean
  label: string
  merge?: boolean
}

function RuleLink(props: IProps): JSX.Element {
  const { double, label, merge } = props

  if (!double) {
    return <LinkLabelSimple>{label}</LinkLabelSimple>
  }

  return (
    <DoubleLinkContainer>
      {merge ? (
        <LinkLabelDoubleMerged>{label}</LinkLabelDoubleMerged>
      ) : (
        <LinkLabelDouble>{label}</LinkLabelDouble>
      )}
    </DoubleLinkContainer>
  )
}

export default RuleLink
