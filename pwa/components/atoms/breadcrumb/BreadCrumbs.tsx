import { Breadcrumbs, Typography } from '@mui/material'
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
  slug: string | string[]
  menu: IMenu
}

function newSlug(data: string[] | string): string[] {
  let newBreadCrumbData = [data[0]]
  for (let index = 0; index < data.length - 1; index++) {
    newBreadCrumbData = [
      ...newBreadCrumbData,
      [newBreadCrumbData.pop()].concat(data[index + 1]).join('_'),
    ]
  }
  return newBreadCrumbData
}

function BreadCrumbs({ menu, slug }: IProps): JSX.Element {
  let labelData: string[] = []
  function findIn(find: string, menu: IMenuChild[]): string[] {
    if (typeof menu === 'object') {
      for (const menuChild in menu) {
        if (menu[menuChild].code === find) {
          labelData = [...labelData, menu[menuChild].label]
        }
        findIn(find, menu[menuChild].children)
      }
      return labelData
    }
    return null
  }

  if (!slug || slug.length === 0) {
    return null
  }

  const slugArray = newSlug(slug)
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'colors.neutral.500' }}>
      {slugArray.map((item: string, key: number) => (
        <Typography key={item}>
          {slugArray.length > key + 1 ? (
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
