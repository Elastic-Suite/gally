import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import {
  Autocomplete,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Popper,
  Typography,
  styled,
} from '@mui/material'
import Search from '@mui/icons-material/Search'

import {
  catalogContext,
  categoryContext,
  configurationsContext,
  searchContext,
} from '../../contexts'
import {
  IGraphqlAggregationOption,
  IGraphqlSearchProducts,
  IGraphqlSearchProductsVariables,
  ProductRequestType,
  addPrefixKeyObject,
  categoryEntityType,
  getAutoCompleteSearchQuery,
  getCategoryPathLabel,
  joinUrlPath,
} from '@elastic-suite/gally-admin-shared'
import { useGraphqlApi } from '../../hooks'
import {
  ICategoryAutoComplete,
  IFacetAutocomplete,
  IProductAutoComplete,
} from '../../types'
import { IGraphqlSearchDocumentsVariables } from '@elastic-suite/gally-admin-shared/src/types/documents'
import { IGraphqlSearchCategories } from '@elastic-suite/gally-admin-shared/src'
import {
  AUTOCOMPLETE_CATEGORY_TYPE,
  AUTOCOMPLETE_FACET_TYPE,
  AUTOCOMPLETE_PRODUCT_TYPE,
} from '../../constants'
import { useNavigate } from 'react-router-dom'

const MIN_AUTOCOMPLETE_CHAR = 3

interface IProps {
  shrink?: boolean
}

const StyledAutocomplete = styled(
  Autocomplete<
    IProductAutoComplete | ICategoryAutoComplete | IFacetAutocomplete,
    boolean,
    boolean,
    boolean
  >
)(({ theme }) => ({
  '&.MuiAutocomplete-hasClearIcon': {
    '.MuiInputBase-root': {
      width: 280,
      paddingRight: theme.spacing(2),
    },
  },
}))

const StyledPopper = styled(Popper)(() => ({
  '& .MuiAutocomplete-groupLabel': {
    fontWeight: 800,
  },
  '& .MuiAutocomplete-listbox': {
    maxHeight: 500,
    display: 'flex',
  },
  '& .MuiAutocomplete-groupUl': {
    border: '1px solid pink',
  },
  '& .MuiAutocomplete-paper': {
    width: 540,
  },
}))
function SearchBar(props: IProps): JSX.Element {
  const { shrink } = props
  const searchId = useId()

  const { localizedCatalogId } = useContext(catalogContext)
  const {
    onSearch,
    search: searchedText,
    productSearch: { setActiveFilters },
  } = useContext(searchContext)
  const baseUrl = useContext(configurationsContext)?.['base_url/media']
  const categories = useContext(categoryContext)

  const controller = useRef<AbortController>()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [documents, setDocuments, _load, debouncedLoad] = useGraphqlApi<
    IGraphqlSearchProducts & IGraphqlSearchCategories
  >()

  let options: (
    | IProductAutoComplete
    | ICategoryAutoComplete
    | IFacetAutocomplete
  )[] =
    documents.data?.products.collection.map((product) => {
      return {
        ...product,
        type: AUTOCOMPLETE_PRODUCT_TYPE,
        price: product.price?.[0]?.price,
      }
    }) ?? []

  options = options.concat(
    documents.data?.categories.collection.map((category) => ({
      ...category,
      type: AUTOCOMPLETE_CATEGORY_TYPE,
    })) ?? []
  )
  documents.data?.products?.aggregations?.forEach((aggregation) => {
    let aggregationOptions: IGraphqlAggregationOption[] = []
    switch (aggregation.type) {
      case 'checkbox':
        aggregationOptions = aggregation.options
        break
      case 'boolean':
        aggregationOptions = aggregation.options.filter(
          (option) => option.value === '1'
        )
        break
    }
    options = options.concat(
      aggregationOptions.map((option) => ({
        ...aggregation,
        type: AUTOCOMPLETE_FACET_TYPE,
        fieldType: aggregation.type,
        option,
      }))
    )
  })
  const loadDocuments = useCallback(
    (querySearch: string) => {
      if (
        localizedCatalogId &&
        querySearch.trim() &&
        querySearch.trim().length >= MIN_AUTOCOMPLETE_CHAR
      ) {
        const productVariables: IGraphqlSearchProductsVariables = {
          localizedCatalog: String(localizedCatalogId),
          requestType: ProductRequestType.AUTOCOMPLETE,
          currentPage: 1,
          pageSize: 5,
          search: querySearch,
        }

        const categoryVariables: IGraphqlSearchDocumentsVariables = {
          entityType: categoryEntityType,
          localizedCatalog: String(localizedCatalogId),
          currentPage: 1,
          pageSize: 5,
          search: querySearch,
        }

        const variables = {
          ...productVariables,
          ...addPrefixKeyObject(categoryVariables, categoryEntityType),
        }

        controller.current = new AbortController()
        return debouncedLoad(
          getAutoCompleteSearchQuery(
            null,
            { equalFilter: { field: 'is_active', eq: 'true' } },
            true
          ),
          variables as unknown as Record<string, unknown>,
          { signal: controller.current.signal }
        )
      }
      controller.current?.abort()
      setDocuments(null)
    },
    [localizedCatalogId, debouncedLoad, setDocuments]
  )
  useEffect(() => {
    setSearch(searchedText)
  }, [searchedText])

  useEffect(() => {
    loadDocuments(search)
  }, [loadDocuments, search])

  function handleSearchChange(
    _event: ChangeEvent<HTMLInputElement>,
    value: IProductAutoComplete | ICategoryAutoComplete | IFacetAutocomplete
  ): void {
    let querySearch = ''

    if (value?.type === AUTOCOMPLETE_CATEGORY_TYPE) {
      navigate(`/category/${value.source.id}`)
    }

    if (value?.type === AUTOCOMPLETE_PRODUCT_TYPE) {
      querySearch = value.name
      setActiveFilters([])
    }

    if (value?.type === AUTOCOMPLETE_FACET_TYPE) {
      querySearch = search
      setActiveFilters([
        {
          filter: {
            ...value,
            type: value.fieldType,
          },
          value: value.option.value,
        },
      ])
    }
    setSearch(querySearch)
    if (querySearch.trim()) {
      onSearch(querySearch)
    }
  }

  function handleInputChange(_event: SyntheticEvent, value: string): void {
    setSearch(value)
  }

  function handleSubmit(event: FormEvent): void {
    event.preventDefault()
    setActiveFilters([])
    onSearch(search)
  }
  return (
    <form onSubmit={handleSubmit}>
      <StyledAutocomplete
        id={searchId}
        getOptionLabel={(option): string => {
          if (typeof option === 'string') {
            return option
          }

          switch (option.type) {
            case AUTOCOMPLETE_CATEGORY_TYPE:
              return option.source.name instanceof Array
                ? option.source.name[0]
                : option.source.name

            case AUTOCOMPLETE_PRODUCT_TYPE:
              return option.name
            case AUTOCOMPLETE_FACET_TYPE:
              return search
          }
        }}
        filterOptions={(
          x: (IProductAutoComplete | ICategoryAutoComplete)[]
        ): (IProductAutoComplete | ICategoryAutoComplete)[] => x}
        options={options}
        autoComplete
        includeInputInList
        freeSolo
        value={search}
        onChange={handleSearchChange}
        onInputChange={handleInputChange}
        PopperComponent={StyledPopper}
        groupBy={(option): string => {
          switch (option.type) {
            case AUTOCOMPLETE_CATEGORY_TYPE:
              return 'Categories'

            case AUTOCOMPLETE_FACET_TYPE:
              return 'Attributs'

            case AUTOCOMPLETE_PRODUCT_TYPE:
            default:
              return 'Products'
          }
        }}
        renderGroup={(item): ReactNode => {
          const { children, group } = item
          return (
            <Grid key={group}>
              <span style={{ paddingLeft: 15, fontWeight: 600 }}>{group}</span>
              {children}
            </Grid>
          )
        }}
        renderInput={({
          InputLabelProps,
          InputProps,
          ...params
        }): ReactNode => (
          <>
            <InputLabel {...InputLabelProps} shrink={shrink}>
              Search
            </InputLabel>
            <OutlinedInput
              {...params}
              {...InputProps}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="search" edge="end" type="submit">
                    <Search />
                  </IconButton>
                </InputAdornment>
              }
              label="Search"
            />
          </>
        )}
        renderOption={(props, option): ReactNode => {
          let key
          // To avoid Facets to have the same keys
          if (option.type === AUTOCOMPLETE_FACET_TYPE) {
            key = `${option.label} ${option.option.label} ${option.option.value}`
          }
          return (
            <li {...props} {...(key ? { key } : {})}>
              <Grid container alignItems="center">
                {option.type === AUTOCOMPLETE_PRODUCT_TYPE && (
                  <>
                    <Grid item sx={{ display: 'flex', width: 50 }}>
                      <img
                        height="50px"
                        style={{ objectFit: 'contain' }}
                        alt={option.name}
                        src={joinUrlPath(baseUrl, option.image as string)}
                      />
                    </Grid>
                    <Grid
                      item
                      sx={{
                        width: 'calc(100% - 50px)',
                        wordWrap: 'break-word',
                      }}
                    >
                      <Box component="span">{option.name}</Box>
                      <Typography variant="body2" color="text.secondary">
                        Sku: {option.sku} - ${option.price}
                      </Typography>
                    </Grid>
                  </>
                )}
                {option.type === AUTOCOMPLETE_CATEGORY_TYPE && (
                  <Grid item sx={{ wordWrap: 'break-word' }}>
                    <Box component="span">{option.source.name}</Box>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span">
                        {getCategoryPathLabel(
                          (option.source.path as string).split('/'),
                          categories
                        )}
                      </Box>
                    </Typography>
                  </Grid>
                )}
                {option.type === AUTOCOMPLETE_FACET_TYPE && (
                  <Grid item sx={{ wordWrap: 'break-word' }}>
                    <Box component="span">{option.label}</Box>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span">
                        {option.fieldType === 'boolean'
                          ? 'Yes'
                          : option.option.label}
                      </Box>
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </li>
          )
        }}
      />
    </form>
  )
}

export default SearchBar
