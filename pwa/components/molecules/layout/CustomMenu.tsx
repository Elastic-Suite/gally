import { useStore } from 'react-admin'
import MenuItemIcon from '~/components/atoms/menu/MenuItemIcon'
import MenuItem from '~/components/atoms/menu/MenuItem'
import { makeStyles } from '@mui/styles'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

/*
 * Create function to create path from code of the menu item
 */
function slugify(code, depth) {
  let slug = code
  for (let i = 0; i < depth; i++) {
    slug = slug.replace('_', '/')
  }
  return slug
}

/*
 * Use of mui makeStyles to create multiple styles reusing theme fm react-admin
 * see: https://mui.com/system/styles/basics/
 */
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: 'auto',
    position: 'unset',
  },
  firstItems: {
    display: 'flex',
    flexDirection: 'column',
  },
  secondItems: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
  },
  boldStyle: {
    paddingBottom: theme.spacing(3),
  },
  lightStyle: {
    paddingTop: theme.spacing(2),
  },
  boldStyleCollapsed: {
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    color: theme.palette.menu.text500,
  },
  lightStyleCollapsed: {
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    color: theme.palette.menu.text500,
  },
}))

const CustomMenu = (props) => {
  /*
   * useStore from ReactAdmin to store data globally
   * see: https://marmelab.com/react-admin/doc/4.0/Store.html
   */
  const [menu, setMenu] = useStore('menu', { hierarchy: [] })
  let [menuItemActive, setMenuItemActive] = useStore(`menuItemActive`)

  /*
   * Function to update menu active item from pathname
   */
  const router = useRouter()
  const { slug } = router.query
  useEffect(() => {
    setMenuItemActive(typeof slug !== 'string' ? slug?.join('_') : slug)
  }, [slug])

  /*
   * Fetch data from /menu to get create menu items dynamically
   */
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/menu')
      const json = await res.json()
      setMenu(json)
    }
    fetchData()
  }, [setMenu])

  const classes = useStyles()

  return (
    <div className={props.className}>
      <div className={classes.firstItems}>
        {menu.hierarchy.map((item, index) => {
          if (!(item.code === 'settings') && !(item.code === 'monitoring')) {
            return (
              <div key={`${index}-${item.code}`} className={classes.boldStyle}>
                <MenuItemIcon
                  href={slugify(item.code, 0)}
                  code={item.code}
                  label={item.label}
                  lightStyle={false}
                  childPadding={!!item.children}
                />
                <div className={classes.secondItems}>
                  {item.children?.map((item, index) => (
                    <div key={`${index}-${item.code}`}>
                      <MenuItem
                        href={slugify(item.code, 1)}
                        id={item.code}
                        code={item.code}
                        label={item.label}
                        children={item.children}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          } else {
            return (
              <div key={`${index}-${item.code}`}>
                <MenuItemIcon
                  href={slugify(item.code, 0)}
                  code={item.code}
                  label={item.label}
                  lightStyle={true}
                  childPadding={false}
                />
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}

export default CustomMenu
