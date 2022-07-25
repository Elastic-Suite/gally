import BreadCrumbs from '~/components/atoms/breadcrumb/BreadCrumbs'
import User from '~/components/molecules/layout/user/User'
import { styled } from '@mui/system'
import { IMenu } from '~/store'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: theme.spacing(1.25),
  paddingBottom: theme.spacing(1.25),
  paddingRight: theme.spacing(4),
  paddingLeft: theme.spacing(4),
  position: 'fixed',
  right: 0,
  zIndex: '9',
  height: theme.spacing(8),
  backgroundColor: theme.palette.background.page,
  left: 'inherit',
  '&::before': {
    content: '""',
    position: 'absolute',
    border: '1px solid',
    borderColor: theme.palette.colors.neutral['300'],
    bottom: 0,
    width: `calc(100% - 64px)`,
  },
}))

interface IProps {
  slug?: string | string[]
  menu?: IMenu
}

function AppBar({ slug, menu }: IProps): JSX.Element {
  return (
    <CustomRoot>
      <BreadCrumbs slug={slug} menu={menu} />
      <User />
    </CustomRoot>
  )
}

export default AppBar
