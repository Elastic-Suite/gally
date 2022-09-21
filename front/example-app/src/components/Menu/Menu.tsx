import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer as MuiDrawer,
  Typography,
  styled,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const navItems = ['Home', 'About', 'Contact']

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    padding: `0 ${theme.spacing(3)}`,
  },
}))

interface IProps {
  menuOpen: boolean
  onMenuToggle: () => void
}

function Menu(props: IProps): JSX.Element {
  const { menuOpen, onMenuToggle } = props

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
          <Divider />
          <List dense>
            {navItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton component={RouterLink} to={item}>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}

export default Menu
