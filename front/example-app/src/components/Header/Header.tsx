import { useId } from 'react'
import {
  AppBar,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl as MuiFormControl,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
  styled,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Link } from 'react-router-dom'
import { ICatalog } from 'shared'

import { useApiList, useResource } from '../../hooks'

const FormControl = styled(MuiFormControl)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  '& .MuiInputBase-root': {
    color: theme.palette.common.white,
    minWidth: 100,
  },
  '& .MuiFormLabel-root': {
    color: theme.palette.common.white,
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.common.white,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.common.white,
  },
  '& .MuiOutlinedInput-notchedOutline legend': {
    maxWidth: '100%',
  },
  '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.common.white,
  },
  '& .MuiFormLabel-root.Mui-focused': {
    color: theme.palette.common.white,
  },
  '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.common.white,
  },
}))

interface IProps {
  catalogId: string | number
  localizedCatalogId: string | number
  onCatalogIdChange?: (catalogId: string | number) => void
  onLocalizedCatalogIdChange?: (localizedCatalogId: string | number) => void
  onMenuToggle?: () => void
}

function Header(props: IProps): JSX.Element {
  const {
    catalogId,
    localizedCatalogId,
    onCatalogIdChange,
    onLocalizedCatalogIdChange,
    onMenuToggle,
  } = props
  const catalogLabelId = useId()
  const catalogSelectId = useId()
  const localizedCatalogLabelId = useId()
  const localizedCatalogSelectId = useId()

  const resourceName = 'Catalog'
  const resource = useResource(resourceName)
  const [catalogs] = useApiList<ICatalog>(resource, false)

  function handleCatalogChange(event: SelectChangeEvent<number>): void {
    onCatalogIdChange(event.target.value)
    onLocalizedCatalogIdChange('')
  }

  function handleLocalizedCatalogChange(
    event: SelectChangeEvent<number>
  ): void {
    onLocalizedCatalogIdChange(event.target.value)
  }

  const catalog = catalogs.data?.['hydra:member'].find(
    (catalog) => catalog.id === catalogId
  )

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
        <FormControl size="small" variant="outlined">
          <InputLabel id={catalogLabelId} shrink>
            Catalog
          </InputLabel>
          <Select
            labelId={catalogLabelId}
            id={catalogSelectId}
            value={catalogId}
            label="Catalog"
            onChange={handleCatalogChange}
            data-testid="header-catalog-select"
            data-testlength={catalogs.data?.['hydra:member'].length}
          >
            {catalogs.data?.['hydra:member'].map((catalog) => (
              <MenuItem key={catalog.id} value={catalog.id}>
                {catalog.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {Boolean(catalog) && (
          <FormControl size="small" variant="outlined">
            <InputLabel id={localizedCatalogLabelId} shrink>
              Localized catalog
            </InputLabel>
            <Select
              labelId={localizedCatalogLabelId}
              id={localizedCatalogSelectId}
              value={localizedCatalogId}
              label="Localized Catalog"
              onChange={handleLocalizedCatalogChange}
            >
              {catalog.localizedCatalogs.map((localizedCatalogs) => (
                <MenuItem
                  key={localizedCatalogs.id}
                  value={localizedCatalogs.id}
                >
                  {localizedCatalogs.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
