import { List } from '@mui/material'
import { ICategory } from 'gally-admin-shared'

import MenuItem from './MenuItem'

interface IProps {
  categories: ICategory[]
}

function MenuList(props: IProps): JSX.Element {
  const { categories } = props

  return (
    <List dense sx={{ py: 0 }}>
      {categories.map((category) => (
        <MenuItem key={category.id} category={category} />
      ))}
    </List>
  )
}

export default MenuList
