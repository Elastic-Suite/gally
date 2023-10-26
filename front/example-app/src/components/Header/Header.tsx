import { useContext, useEffect, useId } from 'react'
import {
  AppBar,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'

import { catalogContext } from '../../contexts'

import HeaderFormControl from '../HeaderFormControl/HeaderFormControl'
import SearchBar from '../SearchBar/SearchBar'
import Logo from './logo.svg'

function Header(): JSX.Element {
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

  useEffect(() => {
    if (catalog) {
      if (catalog?.localizedCatalogs) {
        onLocalizedCatalogIdChange(
          catalog.localizedCatalogs.edges[0].node.id as string
        )
      }
    }
  }, [catalog, onLocalizedCatalogIdChange])

  useEffect(() => {
    if (catalogs.length !== 0 && !catalog) {
      onCatalogIdChange(catalogs[0].id as string)
    }
  }, [catalogs, onCatalogIdChange, catalog])

  return (
    <AppBar component="nav">
      <Toolbar>
        <Typography
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          component={Link}
          sx={{ flexGrow: 1 }}
          to="/"
          variant="h6"
        >
          <div>
            <img src={Logo} alt="Logo" />
          </div>
          <div>Gally - Example App</div>
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
