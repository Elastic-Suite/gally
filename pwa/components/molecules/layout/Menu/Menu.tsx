import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

import { IMenu } from '~/store'
import MenuItemIcon from '~/components/atoms/menu/MenuItemIcon'
import MenuItem from '~/components/atoms/menu/MenuItem'

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
const useStyles = makeStyles((theme: Theme) => ({
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

interface IProps {
  childrenState: Record<string, boolean>
  className?: string
  menu: IMenu
  menuItemActive: string
  onChildToggle: (code: string, childState: boolean) => void
  sidebarState?: boolean
  sidebarStateTimeout?: boolean
}

function Menu(props: IProps) {
  const {
    childrenState,
    className,
    menu,
    menuItemActive,
    onChildToggle,
    sidebarState,
    sidebarStateTimeout,
  } = props
  const words = menuItemActive.split('_')
  const classes = useStyles()

  return (
    <div className={className}>
      <div className={classes.firstItems}>
        {menu?.hierarchy.map((item, index) => {
          if (!(item.code === 'settings') && !(item.code === 'monitoring')) {
            return (
              <div key={`${index}-${item.code}`} className={classes.boldStyle}>
                <MenuItemIcon
                  code={item.code}
                  href={slugify(item.code, 0)}
                  isActive={menuItemActive === item.code}
                  isRoot={words[0] === item.code}
                  label={item.label}
                  lightStyle={false}
                  childPadding={!!item.children}
                  sidebarState={sidebarState}
                  sidebarStateTimeout={sidebarStateTimeout}
                />
                <div className={classes.secondItems}>
                  {item.children?.map((item, index) => (
                    <div key={`${index}-${item.code}`}>
                      <MenuItem
                        childrenState={childrenState}
                        code={item.code}
                        href={slugify(item.code, 1)}
                        isActive={menuItemActive === item.code}
                        isBoosts={
                          words.length > 2 &&
                          words.slice(0, 2).join('_') === item.code &&
                          words[2] !== 'boosts'
                        }
                        label={item.label}
                        menuChildren={item.children}
                        onToggle={onChildToggle}
                        sidebarStateTimeout={sidebarStateTimeout}
                        words={words}
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
                  code={item.code}
                  href={slugify(item.code, 0)}
                  isActive={menuItemActive === item.code}
                  isRoot={words[0] === item.code}
                  label={item.label}
                  lightStyle
                  childPadding={false}
                  sidebarState={sidebarState}
                  sidebarStateTimeout={sidebarStateTimeout}
                />
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}

export default Menu
