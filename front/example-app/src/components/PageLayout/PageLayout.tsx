import { ReactNode, useContext, useEffect, useState } from 'react'
import { styled } from '@mui/material'

import PageTitle from '../../components/PageTitle/PageTitle'

import { ICategory } from '@elastic-suite/gally-admin-shared'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Link, useLocation } from 'react-router-dom'
import { categoryContext } from 'src/contexts'

const CustomRoot = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  gap: '4px',
})

const CustomRootSubMenu = styled(CustomRoot)({
  backgroundColor: '#ededed',
  padding: '16px 0',
  borderRadius: '8px',
  marginTop: '16px',
  position: 'absolute',
  width: '100%',
  zIndex: 5,
})

const CustomRootInMap = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  padding: '20px 16px',
  borderRadius: theme.spacing(1),
  ':hover': {
    cursor: 'pointer',
    textDecoration: 'underline',
    background: '#c6eaff',
  },
}))

interface ICategorySubMenu {
  children: ICategory[]
  id: string
}

const Root = styled('div')({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
})

const Content = styled('div')(({ theme }) => ({
  flex: 1,
  paddingTop: theme.spacing(2),
}))

interface IProps {
  children?: ReactNode
  title: string
  selectCategoryId?: string
}

function PageLayout(props: IProps): JSX.Element {
  const { children, title, selectCategoryId } = props

  const categories = useContext(categoryContext)
  const [newCat, setNewCat] = useState<ICategory[] | null>(null)

  const [sousMenu, setSousMenu] = useState<ICategorySubMenu | null>(null)

  useEffect(() => {
    if (categories.length !== 0) {
      setNewCat(
        [
          {
            id: 'cat_2',
            name: 'Default Category',
            level: 1,
            isVirtual: false,
            path: 'cat_2',
          },
        ].concat(categories[0].children)
      )
    }
  }, [categories])

  const [isSousMenuVisible, setIsSousMenuVisible] = useState(false)

  function handleOnMousseEnter(item: ICategory): void {
    setSousMenu({
      id: item.id,
      children: item.children ? item.children : null,
    })
    setIsSousMenuVisible(true)
  }

  const location = useLocation()

  useEffect(() => {
    setIsSousMenuVisible(false)
  }, [location?.pathname])

  return (
    newCat && (
      <Root>
        <div
          style={{ padding: ' 0 0 20px 0', position: 'relative' }}
          onMouseLeave={(): void => setIsSousMenuVisible(false)}
        >
          <CustomRoot>
            {newCat.map((item) => {
              const isBackground = item?.children?.find(
                (item) => item.id === selectCategoryId
              )
              return (
                <Link
                  style={{ display: 'flex' }}
                  key={item.id}
                  to={`/category/${item.id}`}
                >
                  <CustomRootInMap
                    onMouseEnter={(): void => handleOnMousseEnter(item)}
                    style={{
                      padding: '8px 16px',
                      background:
                        isBackground ||
                        selectCategoryId === item.id ||
                        (sousMenu?.id === item.id && isSousMenuVisible)
                          ? '#c6eaff'
                          : 'initial',
                    }}
                  >
                    {item.name}
                    {item.children ? <KeyboardArrowDownIcon /> : null}
                  </CustomRootInMap>
                </Link>
              )
            })}
          </CustomRoot>
          {sousMenu ? (
            sousMenu.children && isSousMenuVisible ? (
              <CustomRootSubMenu
                onMouseLeave={(): void => setIsSousMenuVisible(false)}
                onMouseEnter={(): void => setIsSousMenuVisible(true)}
              >
                <div
                  style={{
                    display: 'flex',
                    minWidth: '500px',
                    justifyContent: 'space-around',
                  }}
                >
                  {sousMenu.children.map((item) => (
                    <Link
                      style={{ display: 'flex' }}
                      key={item.id}
                      to={`/category/${item.id}`}
                    >
                      <CustomRootInMap
                        style={{
                          background:
                            selectCategoryId === item.id ? '#c6eaff' : '',
                        }}
                      >
                        {item.name}
                      </CustomRootInMap>
                    </Link>
                  ))}
                </div>
              </CustomRootSubMenu>
            ) : null
          ) : null}
        </div>

        <PageTitle title={title} />
        <Content>{children}</Content>
      </Root>
    )
  )
}

export default PageLayout
