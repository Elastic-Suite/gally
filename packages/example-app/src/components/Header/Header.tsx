import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Link } from 'react-router-dom'

interface IProps {
  onMenuToggle: () => void
}

function Header(props: IProps): JSX.Element {
  const { onMenuToggle } = props
  return (
    <AppBar component="nav">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuToggle}
        >
          <MenuIcon />
        </IconButton>
        <Typography component={Link} to="/" variant="h6">
          Example App{' '}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Header
