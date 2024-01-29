import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bundle,
  IFetch,
  IGraphqlSearchProducts,
  ProductRequestType,
  productEntityType,
} from '@elastic-suite/gally-admin-shared'
import { Search } from '@mui/icons-material'
import {
  Divider,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from '@mui/material'

import { VECTOR_SEARCH_ROUTE } from 'src/constants'
import { extraBundlesContext } from 'src/contexts'
import { useProducts, useVectorSearchDocuments } from 'src/hooks'
import { transformVectorSearchDocumentsIntoProducts } from 'src/services'
import PageLayout from 'src/components/PageLayout/PageLayout'
import { CustomTitle } from 'src/components/PageTitle/PageTitle'
import ProductList from 'src/components/Products/ProductList'

function VectorSearch(): JSX.Element {
  const leftPanelTitle = 'Fulltext search'
  const rightPanelTitle = 'Vector search'

  const [search, setSearch] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { extraBundles, isExtraBundleAvailable } =
    useContext(extraBundlesContext)

  const {
    page: productsPage,
    pageSize: productsPageSize,
    products,
    setPage: productsSetPage,
    setPageSize: productsSetPageSize,
    setSort: productsSetSort,
    setSortOrder: productsSetSortOrder,
    sort: productsSort,
    sortOptions: productsSortOptions,
    sortOrder: productsSortOrder,
    loadProducts,
  } = useProducts(ProductRequestType.SEARCH, null, search, 50)

  const {
    page: VSPage,
    pageSize: VSPageSize,
    vectorSearchDocuments,
    setPage: VSSetPage,
    setPageSize: VSSetPageSize,
    setSort: VSSetSort,
    setSortOrder: VSSetSortOrder,
    sort: VSSort,
    sortOptions: VSSortOptions,
    sortOrder: VSSortOrder,
    loadVectorSearchDocuments,
  } = useVectorSearchDocuments(productEntityType, search, 50)

  const vectorSearchProducts: IFetch<IGraphqlSearchProducts> = useMemo(() => {
    return transformVectorSearchDocumentsIntoProducts(vectorSearchDocuments)
  }, [vectorSearchDocuments])

  useEffect(() => {
    loadProducts(Boolean(search))
    loadVectorSearchDocuments(Boolean(search))
  }, [search, loadProducts, loadVectorSearchDocuments])

  useEffect(() => {
    if (
      extraBundles &&
      location.pathname === VECTOR_SEARCH_ROUTE &&
      !isExtraBundleAvailable(Bundle.VECTOR_SEARCH)
    ) {
      navigate('/')
    }
  }, [location.pathname, navigate, isExtraBundleAvailable, extraBundles])

  return (
    <PageLayout title={`Search results for "${search}"`}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '50px',
        }}
      >
        <form
          onSubmit={(e): void => {
            e.preventDefault()
            const data = new FormData(e.target as HTMLFormElement)
            if (data instanceof FormData) {
              const vectorSearchValue = data.get('vectorSearch').toString()
              if (vectorSearchValue) {
                setSearch(vectorSearchValue)
              }
            }
          }}
        >
          <OutlinedInput
            placeholder="Search"
            name="vectorSearch"
            notched={false}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="search" edge="end" type="submit">
                  <Search />
                </IconButton>
              </InputAdornment>
            }
            label="Search"
          />
        </form>
      </div>
      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ flex: 1 }}>
          <CustomTitle>{leftPanelTitle}</CustomTitle>
          <ProductList
            hasSortOptions={false}
            page={productsPage}
            pageSize={productsPageSize}
            products={products}
            setPage={productsSetPage}
            setPageSize={productsSetPageSize}
            setSort={productsSetSort}
            setSortOrder={productsSetSortOrder}
            sort={productsSort}
            sortOptions={productsSortOptions}
            sortOrder={productsSortOrder}
          />
        </div>
        <Divider
          flexItem
          orientation="vertical"
          sx={{
            borderRightWidth: 3,
            bgcolor: '#1976d2',
            minHeight: '127px',
          }}
        />
        <div style={{ flex: 1 }}>
          <CustomTitle>{rightPanelTitle}</CustomTitle>
          <ProductList
            hasSortOptions={false}
            page={VSPage}
            pageSize={VSPageSize}
            products={vectorSearchProducts}
            setPage={VSSetPage}
            setPageSize={VSSetPageSize}
            setSort={VSSetSort}
            setSortOrder={VSSetSortOrder}
            sort={VSSort}
            sortOptions={VSSortOptions}
            sortOrder={VSSortOrder}
          />
        </div>
      </div>
    </PageLayout>
  )
}

export default VectorSearch
