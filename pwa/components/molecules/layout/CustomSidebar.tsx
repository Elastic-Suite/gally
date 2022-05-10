import { useSidebarState, useStore } from 'react-admin'
import { useEffect } from 'react'
import CustomMenu from '~/components/molecules/layout/CustomMenu'
import LogoExtended from '~/assets/images/LogoBlinkExtended.svg'
import LogoCollapse from '~/assets/images/LogoBlinkCollapse.svg'
import { makeStyles } from '@mui/styles'
import { Collapse } from '@mui/material'

/*
 * Use of mui makeStyles to create multiple styles reusing theme fm react-admin
 * see: https://mui.com/system/styles/basics/
 */
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    maxWidth: 278,
    minHeight: '100vh',
    background: theme.palette.background.paper,
    // border: '1px solid #E2E6F3',
  },
  rootCollapsed: {
    width: 'inherit',
  },
  imgContainer: {
    position: 'relative',
    paddingBottom: theme.spacing(6),
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2.5),
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
  width50: {
    width: '50px',
  },
}))

const CustomSidebar = (props) => {
  /*
   * useStore from ReactAdmin to store data globally
   * see: https://marmelab.com/react-admin/doc/4.0/Store.html
   */
  const [sidebarState] = useSidebarState()

  const classes = useStyles()

  /*
   * Use of Collapse from mui to collapse sidebar when button is clicked
   * see: https://mui.com/material-ui/transitions/#collapse
   */
  return (
    <Collapse
      in={sidebarState}
      orientation={'horizontal'}
      collapsedSize={66}
      timeout={sidebarState ? 0 : 200}
      style={{ borderRight: '1px solid #E2E6F3', boxSizing: 'unset' }}
    >
      <div
        className={
          classes.root + (sidebarState ? '' : ' ' + classes.rootCollapsed)
        }
      >
        <div className={classes.imgContainer}>
          <img
            src={LogoExtended.src}
            className={
              classes.imgExtended +
              (sidebarState ? '' : ' ' + classes.imgNotActive)
            }
            alt={LogoExtended.name}
          />
          <img
            src={LogoCollapse.src}
            className={
              classes.imgCollapse +
              (sidebarState ? ' ' + classes.imgNotActive : '')
            }
            alt={LogoCollapse.name}
          />
        </div>
        <CustomMenu
          className={classes.menu + (sidebarState ? '' : ' ' + classes.width50)}
        />
      </div>
    </Collapse>
  )
}

export default CustomSidebar
