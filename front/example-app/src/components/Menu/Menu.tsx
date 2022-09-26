import { useContext } from 'react'
import {
  Box,
  Divider,
  Drawer as MuiDrawer,
  Typography,
  styled,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { categoryContext } from '../../contexts'

import MenuList from './MenuList'

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    padding: `0 ${theme.spacing(3)}`,
  },
}))

interface IProps {
  menuOpen: boolean
  onMenuToggle?: () => void
}

function Menu(props: IProps): JSX.Element {
  const { menuOpen, onMenuToggle } = props
  const categories = useContext(categoryContext)

  return (
    <Box component="nav">
      <Drawer
        variant="temporary"
        open={menuOpen}
        onClose={onMenuToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <Box onClick={onMenuToggle} sx={{ textAlign: 'center' }}>
          <Typography
            component={RouterLink}
            to="/"
            sx={{ display: 'inline-block', my: 1 }}
            variant="h6"
          >
            Example App
          </Typography>
          <Divider sx={{ mb: 1 }} />
          {Boolean(categories.length) && <MenuList categories={categories} />}
        </Box>
      </Drawer>
    </Box>
  )
}

export default Menu
