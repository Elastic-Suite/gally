import { Typography } from '@mui/material'
import { styled } from '@mui/system'

const CustomBreadCrumb = styled('span')({
  fontWeight: '500',
  fontSize: '12px',
  lineHeight: '18px',
})

const CustomBreadCrumbColorClassique = styled(CustomBreadCrumb)(
  ({ theme }) => ({
    color: theme.palette.colors.neutral['500'],
  })
)

const CustomBreadCrumbColorLast = styled(CustomBreadCrumb)(({ theme }) => ({
  color: theme.palette.colors.neutral['800'],
}))

interface IProps {
  label: string
  last: boolean
}

function Breadcrumb(props: IProps): JSX.Element {
  const { label, last } = props
  const Component = last
    ? CustomBreadCrumbColorLast
    : CustomBreadCrumbColorClassique
  return (
    <Typography>
      <Component>{label}</Component>
    </Typography>
  )
}

export default Breadcrumb
