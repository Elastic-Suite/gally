import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/system'
import { IMenu, IMenuChild } from '~/store'

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
  slug: string[]
  menu: IMenu
}

const BreadCrumbs = (props: IProps) => {
  const { menu, slug } = props

  let labelData = []
  function findIn(find: string, menu: IMenuChild[]) {
    if (typeof menu === 'object') {
      for (const menuChild in menu) {
        if (menu[menuChild].code === find) {
          labelData = [...labelData, menu[menuChild].label]
        }
        findIn(find, menu[menuChild].children)
      }
      return labelData
    } else return null
  }

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ color: '#8187B9' }}>
      {slug.map((item: string, key: number) => (
        <Typography key={key}>
          {slug.length > key + 1 ? (
            <CustomBreadCrumbColorClassique>
              {findIn(item, menu.hierarchy)[key]}
            </CustomBreadCrumbColorClassique>
          ) : (
            <CustomBreadCrumbColorLast>
              {findIn(item, menu.hierarchy)[key]}
            </CustomBreadCrumbColorLast>
          )}
        </Typography>
      ))}
    </Breadcrumbs>
  )
}

export default BreadCrumbs
