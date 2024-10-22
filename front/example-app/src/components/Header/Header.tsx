import { useContext, useEffect, useId } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bundle } from '@elastic-suite/gally-admin-shared'
import {
  AppBar,
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from '@mui/material'

import { catalogContext, extraBundlesContext } from '../../contexts'

import HeaderFormControl from '../HeaderFormControl/HeaderFormControl'
import SearchBar from '../SearchBar/SearchBar'
import Logo from './logo.svg'
import Settings from '../Settings/Settings'

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
  const navigate = useNavigate()
  const { isExtraBundleAvailable } = useContext(extraBundlesContext)

  const demoVectorSearchLabel = 'Demo Vector Search'

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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Typography
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            component={Link}
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
          <Box>
            {isExtraBundleAvailable(Bundle.VECTOR_SEARCH) && (
              <Button
                variant="contained"
                style={{ border: '1px solid white', textTransform: 'none' }}
                disableElevation
                onClick={(): void => navigate('/vectorSearch')}
              >
                {demoVectorSearchLabel}
              </Button>
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
          </Box>
        </Box>
        <Settings />
      </Toolbar>
    </AppBar>
  )
}

export default Header
