import { useContext, useId } from 'react'
import {
  AppBar,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Link } from 'react-router-dom'

import { catalogContext } from '../../contexts'

import HeaderFormControl from '../HeaderFormControl/HeaderFormControl'
import SearchBar from '../SearchBar/SearchBar'

interface IProps {
  onMenuToggle?: () => void
}

function Header(props: IProps): JSX.Element {
  const { onMenuToggle } = props
  const catalogLabelId = useId()
  const catalogSelectId = useId()
  const localizedCatalogLabelId = useId()
  const localizedCatalogSelectId = useId()
  const {
    catalog,
    catalogs,
    localizedCatalog,
    onCatalogIdChange,
    onLocalizedCatalogIdChange,
  } = useContext(catalogContext)

  function handleCatalogChange(event: SelectChangeEvent<string>): void {
    onCatalogIdChange(event.target.value)
    onLocalizedCatalogIdChange('')
  }

  function handleLocalizedCatalogChange(
    event: SelectChangeEvent<string>
  ): void {
    onLocalizedCatalogIdChange(event.target.value)
  }

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
        <Typography component={Link} sx={{ flexGrow: 1 }} to="/" variant="h6">
          Example App
        </Typography>
        {Boolean(catalog && localizedCatalog) && (
          <HeaderFormControl size="small">
            <SearchBar shrink />
          </HeaderFormControl>
        )}
        <HeaderFormControl size="small" variant="outlined">
          <InputLabel id={catalogLabelId} shrink>
            Catalog
          </InputLabel>
          <Select
            labelId={catalogLabelId}
            id={catalogSelectId}
            value={catalog?.id ?? ''}
            label="Catalog"
            onChange={handleCatalogChange}
            data-testid="header-catalog-select"
            data-testlength={catalogs.length}
          >
            {catalogs.map((catalog) => (
              <MenuItem key={catalog.id} value={catalog.id}>
                {catalog.name}
              </MenuItem>
            ))}
          </Select>
        </HeaderFormControl>
        {Boolean(catalog) && (
          <HeaderFormControl size="small" variant="outlined">
            <InputLabel id={localizedCatalogLabelId} shrink>
              Localized catalog
            </InputLabel>
            <Select
              labelId={localizedCatalogLabelId}
              id={localizedCatalogSelectId}
              value={localizedCatalog?.id ?? ''}
              label="Localized Catalog"
              onChange={handleLocalizedCatalogChange}
            >
              {catalog.localizedCatalogs.edges.map(({ node }) => (
                <MenuItem key={node.id} value={node.id}>
                  {node.name}
                </MenuItem>
              ))}
            </Select>
          </HeaderFormControl>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
