import BreadCrumb from '~/components/molecules/layout/breadcrumb/BreadCrumb'
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
  backgroundColor: theme.palette.colors.neutral['100'],
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
  stories?: boolean
  slug?: string[]
  menu?: IMenu
}

const AppBar = ({ stories = false, slug, menu }: IProps) => {
  return (
    <CustomRoot
      style={
        stories
          ? { width: '100%', boxSizing: 'border-box', height: '84px' }
          : {}
      }
    >
      {stories ? <BreadCrumbs slug={slug} menu={menu} /> : <BreadCrumb />}
      <User />
    </CustomRoot>
  )
}

export default AppBar
