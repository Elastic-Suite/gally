import { styled } from '@mui/system'
import { ReactNode } from 'react'

const CustomRoot = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row',
})

const CustomBorder = styled('div')(({ theme }) => ({
  borderRadius: theme.spacing(1),
  border: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
}))

const CustomLeftSide = styled(CustomBorder)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: 402,
  boxSizing: 'border-box',
  backgroundColor: theme.palette.colors.white,
}))

const CustomRightSide = styled('div')({
  width: `calc(100% - 390px)`,
  boxSizing: 'border-box',
  paddingLeft: '25px',
})

interface IProps {
  left: ReactNode[] | ReactNode
  children: ReactNode
}

function TwoColsLayout({ left, children }: IProps): JSX.Element {
  return (
    <CustomRoot>
      <CustomLeftSide>{left}</CustomLeftSide>
      <CustomRightSide>{children}</CustomRightSide>
    </CustomRoot>
  )
}

export default TwoColsLayout
