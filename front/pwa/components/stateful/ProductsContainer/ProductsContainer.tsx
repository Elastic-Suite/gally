import { Box, styled } from '@mui/system'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ICatalog,
  ICategory,
  ICategorySortingOption,
  IHydraResponse,
  IParsedCategoryConfiguration,
  IProductFieldFilterInput,
  getCatalogForSearchProductApi,
} from 'shared'

import Button from '~/components/atoms/buttons/Button'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import PageTitle from '~/components/atoms/PageTitle/PageTitle'
import StickyBar from '~/components/molecules/CustomTable/StickyBar/StickyBar'
import ProductsTopAndBottom from '~/components/stateful/ProductsTopAndBottom/ProductsTopAndBottom'
import Merchandize from '../Merchandize/Merchandize'

import { useApiList, useResource } from '~/hooks'
import SearchBar from '../Merchandize/SearchBar/SearchBar'

const Layout = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  marginLeft: '32px',
  marginRight: '28px',
}))

const ActionsButtonsContainer = styled(Box)({
  marginLeft: 'auto',
})

interface IProps {
  catConf: IParsedCategoryConfiguration
  catalog: number
  catalogsData: IHydraResponse<ICatalog>
  category: ICategory
  disableBtnSave: boolean
  error: Error
  isLoading?: boolean
  localizedCatalog: number
  onNameChange: (val: boolean) => void
  onSortChange: (val: string) => void
  onSave: () => void
  onVirtualChange: (val: boolean) => void
  productGraphqlFilters: IProductFieldFilterInput
  setSavePositionsCategoryProductMerchandising: any
}

function ProductsContainer(props: IProps): JSX.Element {
  const {
    catConf,
    catalog,
    catalogsData,
    category,
    disableBtnSave,
    error,
    isLoading,
    localizedCatalog,
    onNameChange,
    onSave,
    onSortChange,
    onVirtualChange,
    productGraphqlFilters,
    setSavePositionsCategoryProductMerchandising,
  } = props

  const tableRef = useRef<HTMLDivElement>()
  const [topSelectedRows, setTopSelectedRows] = useState<string[]>([])
  const [bottomSelectedRows, setBottomSelectedRows] = useState<string[]>([])

  const useNameInProductSearch = catConf?.useNameInProductSearch ?? false
  const isVirtual = catConf?.isVirtual ?? false
  const defaultSorting = catConf?.defaultSorting ?? ''

  const { t } = useTranslation('categories')

  const showStickyBar =
    Boolean(topSelectedRows && topSelectedRows.length > 0) ||
    Boolean(bottomSelectedRows && bottomSelectedRows.length > 0)

  function unselectAllRows(): void {
    setTopSelectedRows([])
    setBottomSelectedRows([])
  }

  const localizedCatalogId =
    catalogsData && catalogsData['hydra:totalItems'] > 0
      ? getCatalogForSearchProductApi(
          catalog,
          localizedCatalog,
          catalogsData['hydra:member']
        )
      : null

  const resourceName = 'CategorySortingOption'
  const resourceSortingOption = useResource(resourceName)
  const [{ data }] = useApiList<ICategorySortingOption>(resourceSortingOption)

  const sortOption = data
    ? data[`hydra:member`].map((obj: ICategorySortingOption) => ({
        value: obj.code,
        ...obj,
      }))
    : [{ label: 'Position', value: 'position' }]

  const [searchValue, setSearchValue] = useState('')
  const onSearchChange = (value: string): void => setSearchValue(value)

  const [listProductsPinedHooks, setListProductsPinedHooks] = useState([])
  const [listProductsUnPinedHooks, setListProductsUnPinedHooks] = useState([])

  function pinToUnPin(): void {
    if (bottomSelectedRows.length + listProductsPinedHooks.length > 25) return

    const unPinToPin = listProductsPinedHooks.filter((el: any) => {
      return topSelectedRows.indexOf(el.id) === -1
    })

    // const pinToUnPin = listProductsPinedHooks.filter((el: any) => {
    //   return topSelectedRows.indexOf(el.id) !== -1
    // })

    setListProductsPinedHooks(unPinToPin)
    // setListProductsUnPinedHooks(pinToUnPin.concat(listProductsUnPinedHooks))
    setTopSelectedRows([])
  }

  function unPinToPin(): void {
    // const pinToUnPin = listProductsUnPinedHooks.filter((el: any) => {
    //   return bottomSelectedRows.indexOf(el.id) === -1
    // })

    const unPinToPin = listProductsUnPinedHooks.filter((el: any) => {
      return bottomSelectedRows.indexOf(el.id) !== -1
    })

    // setListProductsUnPinedHooks(pinToUnPin)
    setListProductsPinedHooks(
      listProductsPinedHooks.concat(
        unPinToPin.map((item, key) => {
          return { ...item, position: listProductsPinedHooks.length + 1 + key }
        })
      )
    )
    setBottomSelectedRows([])
  }

  useEffect(() => {
    const savePositionsCategory = listProductsPinedHooks.map((item, key) => {
      return {
        productId: Number(item.id.split('/')[2]),
        position: key + 1,
      }
    })
    return setSavePositionsCategoryProductMerchandising(savePositionsCategory)
  }, [listProductsPinedHooks])

  if (error || !catalogsData) {
    return null
  }

  return (
    <Box>
      <Layout>
        <PageTitle
          sticky
          sx={{ marginBottom: '12px' }}
          title={category?.name ? category?.name : category?.catalogName}
        >
          <Button
            disabled={disableBtnSave}
            onClick={onSave}
            loading={isLoading}
          >
            {t('buttonSave')}
          </Button>
        </PageTitle>
        <Merchandize
          onVirtualChange={onVirtualChange}
          virtualCategoryValue={isVirtual}
          onNameChange={onNameChange}
          categoryNameValue={useNameInProductSearch}
          onSortChange={onSortChange}
          sortValue={defaultSorting}
          sortOptions={sortOption}
        />

        <SearchBar
          nbResults={10}
          value={searchValue}
          onChange={onSearchChange}
        />

        <ProductsTopAndBottom
          ref={tableRef}
          bottomSelectedRows={bottomSelectedRows}
          catalogId={catalog}
          category={category}
          localizedCatalogId={localizedCatalogId}
          productGraphqlFilters={productGraphqlFilters}
          onBottomSelectedRows={setBottomSelectedRows}
          onTopSelectedRows={setTopSelectedRows}
          topSelectedRows={topSelectedRows}
          setListProductsPinedHooks={setListProductsPinedHooks}
          listProductsPinedHooks={listProductsPinedHooks}
          listProductsUnPinedHooks={listProductsUnPinedHooks}
          setListProductsUnPinedHooks={setListProductsUnPinedHooks}
        />
      </Layout>
      <StickyBar positionRef={tableRef} show={showStickyBar}>
        {t('rows.selected', {
          count: topSelectedRows.length + bottomSelectedRows.length,
        })}
        <ActionsButtonsContainer>
          <Button display="tertiary" onClick={(): void => unselectAllRows()}>
            {t('button.cancelSelection')}
          </Button>
          <Button
            sx={{ marginLeft: 1 }}
            disabled={
              bottomSelectedRows.length === 0 ||
              bottomSelectedRows.length + listProductsPinedHooks.length > 25
            }
            onClick={unPinToPin}
          >
            {t('pinToTop')}
            <IonIcon name="arrow-up-outline" style={{ marginLeft: '13px' }} />
          </Button>
          <Button
            sx={{ marginLeft: 1 }}
            disabled={topSelectedRows.length === 0}
            onClick={pinToUnPin}
          >
            {t('pinToBottom')}
            <IonIcon name="arrow-down-outline" style={{ marginLeft: '13px' }} />
          </Button>
        </ActionsButtonsContainer>
      </StickyBar>
    </Box>
  )
}

export default ProductsContainer
