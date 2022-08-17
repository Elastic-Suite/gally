import { styled } from '@mui/system'

const CustomConditions = styled('div')(({ theme }) => ({
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
  zIndex: 2,
}))

const CustomConditionSimple = styled(CustomConditions)(({ theme }) => ({
  '&:before': {
    content: '""',
    position: 'absolute',
    border: '1px dotted',
    borderColor: theme.palette.colors.neutral['500'],
    borderTop: 'none',
    borderRight: 'none',
    width: '24px',
    left: '50%',
    height: '36px',
    top: '100%',
  },
}))

const CustomConditionSimpleBig = styled(CustomConditionSimple)({
  '&:before': {
    content: '""',
    height: '42px',
  },
})

const CustomConditionDoubleNoBottom = styled(CustomConditions)(({ theme }) => ({
  '&:before': {
    content: '""',
    position: 'absolute',
    border: '1px dotted',
    borderColor: theme.palette.colors.neutral['500'],
    borderBottom: 'none',
    borderRight: 'none',
    width: '24px',
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
    width: '0',
    left: '50%',
    height: '11px',
    top: '100%',
  },
}))

const CustomConditionDouble = styled(CustomConditionDoubleNoBottom)(
  ({ theme }) => ({
    '&:after': {
      width: '24px',
      height: '12px',
    },
  })
)

interface IProps {
  big?: boolean
  simple?: boolean
  verySimple?: boolean
  label: string
  noBorderBottom?: boolean
}

const TypesConditions = ({
  big,
  simple,
  verySimple,
  label,
  noBorderBottom,
}: IProps): JSX.Element => {
  let Condition
  if (verySimple) {
    Condition = CustomConditions
  } else if (simple) {
    if (big) {
      Condition = CustomConditionSimpleBig
    } else {
      Condition = CustomConditionSimple
    }
  } else {
    if (noBorderBottom) {
      Condition = CustomConditionDoubleNoBottom
    } else {
      Condition = CustomConditionDouble
    }
  }

  return <Condition>{label}</Condition>
}

export default TypesConditions
