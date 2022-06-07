import CustomMenu from '~/components/molecules/layout/CustomMenu'
import LogoExtended from '~/assets/images/LogoBlinkExtended.svg'
import LogoCollapse from '~/assets/images/LogoBlinkCollapse.svg'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { Collapse } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { selectSidebarState, selectSidebarStateTimeout, useAppSelector } from '~/store'

/*
 * Use of mui makeStyles to create multiple styles reusing theme fm react-admin
 * see: https://mui.com/system/styles/basics/
 */
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    width: 278,
    minHeight: '100vh',
    background: theme.palette.background.paper,
    paddingBottom: theme.spacing(3),
  },
  rootCollapsed: {
    width: 'inherit',
  },
  imgContainer: {
    position: 'relative',
    paddingBottom: theme.spacing(6),
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2.5),
    cursor: 'pointer',
  },
  imgExtended: {
    position: 'absolute',
    width: 104,
    transition: 'opacity 500ms',
  },
  imgCollapse: {
    position: 'absolute',
    width: 31,
    transition: 'opacity 500ms',
  },
  imgNotActive: {
    opacity: 0,
  },
  menu: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  widthCollapse: {
    width: '50px', // 50px + 16px padding = 66px
  },
  leftBar: {
    borderRight: '1px solid #E2E6F3',
    boxSizing: 'unset',
    height: '100vh',
    overflowY: 'scroll',
    position: 'fixed',
    left: '0',
    top: '0',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      width: 0,
    },
  },
}))

const CustomSidebar = (props) => {
  const sidebarState = useAppSelector(selectSidebarState)
  const sidebarStateTimeout = useAppSelector(selectSidebarStateTimeout)

  const classes = useStyles()

  /*
   * Use of Collapse from mui to collapse sidebar when button is clicked
   * see: https://mui.com/material-ui/transitions/#collapse
   */
  return (
    <Collapse
      in={sidebarState}
      orientation={'horizontal'}
      collapsedSize={sidebarState ? 278 : 66}
      timeout={sidebarState ? 0 : 200}
      className={classes.leftBar}
    >
      <div
        className={
          classes.root + (sidebarState ? '' : ' ' + classes.rootCollapsed)
        }
      >
        <Link href={'/'} as={'/'}>
          <div className={classes.imgContainer}>
            <Image
              src={LogoExtended.src}
              className={
                classes.imgExtended +
                (!sidebarStateTimeout ? '' : ' ' + classes.imgNotActive)
              }
              alt={LogoExtended.name}
              width="104"
              height="29"
            />
            <Image
              src={LogoCollapse.src}
              className={classes.imgCollapse}
              alt={LogoCollapse.name}
              width="31"
              height="29"
            />
          </div>
        </Link>
        <CustomMenu
          className={
            classes.menu + (sidebarState ? '' : ' ' + classes.widthCollapse)
          }
        />
      </div>
    </Collapse>
  )
}

export default CustomSidebar
