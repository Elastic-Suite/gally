import { MouseEvent, useState } from 'react'
import {
  Collapse,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { Link } from 'react-router-dom'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { ICategory } from '@elastic-suite/gally-admin-shared'

import MenuList from './MenuList'

interface IProps {
  category: ICategory
}

function MenuItem(props: IProps): JSX.Element {
  const { category } = props
  const [open, setOpen] = useState(false)

  function handleClick(event: MouseEvent): void {
    event.stopPropagation()
    setOpen((prevState) => !prevState)
  }

  return (
    <>
      <ListItem
        key={category.id}
        disablePadding
        sx={{ pl: 2 * (category.level - 1) }}
      >
        <ListItemButton component={Link} to={`/category/${category.id}`}>
          <ListItemText>{category.name}</ListItemText>
        </ListItemButton>
        {Boolean(category.children) && (
          <IconButton onClick={handleClick} size="small">
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </ListItem>
      {Boolean(category.children) && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <MenuList categories={category.children} />
        </Collapse>
      )}
    </>
  )
}

export default MenuItem
