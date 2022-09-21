import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material'

import { IMenu, findBreadcrumbLabel, getSlugArray } from 'shared'

import Breadcrumb from './Breadcrumb'

interface IProps {
  slug: string | string[]
  menu: IMenu
}

function Breadcrumbs(props: IProps): JSX.Element {
  const { menu, slug } = props

  if (!slug || slug.length === 0 || menu.hierarchy.length === 0) {
    return null
  }

  const breadcrumbProps = getSlugArray(slug)
    .map((item: string, index: number, slug: string[]) => ({
      key: item,
      label: findBreadcrumbLabel(index, slug, menu.hierarchy),
      last: slug.length <= index + 1,
    }))
    .filter(({ label }) => label)
  return (
    <MuiBreadcrumbs
      aria-label="breadcrumb"
      sx={{ color: 'colors.neutral.500' }}
    >
      {breadcrumbProps.map(({ key, ...props }) => (
        <Breadcrumb key={key} {...props} />
      ))}
    </MuiBreadcrumbs>
  )
}

export default Breadcrumbs
