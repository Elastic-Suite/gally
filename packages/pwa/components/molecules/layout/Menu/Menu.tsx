import { styled } from '@mui/system'
import { IMenu, IMenuChild } from 'shared'

import MenuItemIcon from '~/components/atoms/menu/MenuItemIcon'
import MenuItem from '~/components/atoms/menu/MenuItem'

/*
 * Create function to create path from code of the menu item
 */
function slugify(code: string, depth: number): string {
  let slug = code
  for (let i = 0; i < depth; i++) {
    slug = slug.replace('_', '/')
  }
  return slug
}

const CustomFirstItems = styled('div')({
  display: 'flex',
  flexDirection: 'column',
})

const CustomBoldStyle = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(3),
}))

const CustomSecondItems = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: theme.spacing(2),
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

function Menu(props: IProps): JSX.Element {
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

  return (
    <div className={className}>
      <CustomFirstItems>
        {menu?.hierarchy.map((item: IMenuChild) => {
          if (!(item.code === 'settings') && !(item.code === 'monitoring')) {
            return (
              <CustomBoldStyle key={item.code}>
                <MenuItemIcon
                  code={item.code}
                  href={slugify(item.code, 0)}
                  isActive={words.includes(item.code)}
                  isRoot={words[0] === item.code}
                  label={item.label}
                  lightStyle={false}
                  childPadding={Boolean(item.children)}
                  sidebarState={sidebarState}
                  sidebarStateTimeout={sidebarStateTimeout}
                />
                <CustomSecondItems>
                  {item.children?.map((item: IMenuChild) => (
                    <div key={item.code}>
                      <MenuItem
                        childrenState={childrenState}
                        code={item.code}
                        href={slugify(item.code, 1)}
                        isActive={words.join('_') === item.code}
                        isBoosts={
                          words.length > 2 &&
                          words.slice(0, 2).join('_') === item.code
                            ? words[2] !== 'boosts'
                            : null
                        }
                        label={item.label}
                        menuChildren={item.children}
                        onToggle={onChildToggle}
                        sidebarStateTimeout={sidebarStateTimeout}
                        words={words}
                      />
                    </div>
                  ))}
                </CustomSecondItems>
              </CustomBoldStyle>
            )
          }
          return (
            <div key={item.code}>
              <MenuItemIcon
                code={item.code}
                href={slugify(item.code, 0)}
                isActive={words.includes(item.code)}
                isRoot={words[0] === item.code}
                label={item.label}
                lightStyle
                childPadding={false}
                sidebarState={sidebarState}
                sidebarStateTimeout={sidebarStateTimeout}
              />
            </div>
          )
        })}
      </CustomFirstItems>
    </div>
  )
}

export default Menu
