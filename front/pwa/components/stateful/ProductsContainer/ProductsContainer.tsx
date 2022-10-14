import { Box, styled } from '@mui/system'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ICatalog,
  ICategory,
  ICategorySortingOption,
  IHydraResponse,
  IParsedCategoryConfiguration,
  IProductFieldFilterInput,
  getCatalogForSearchProductApi,
  savePositions,
  storageGet,
  tokenStorageKey,
} from 'shared'

import Button from '~/components/atoms/buttons/Button'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import PageTitle from '~/components/atoms/PageTitle/PageTitle'
import StickyBar from '~/components/molecules/CustomTable/StickyBar/StickyBar'
import ProductsTopAndBottom from '~/components/stateful/ProductsTopAndBottom/ProductsTopAndBottom'
import Merchandize from '../Merchandize/Merchandize'

import { useApiList, useGraphqlApi, useResource } from '~/hooks'
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
  isSaving?: boolean
  localizedCatalog: number
  onNameChange: (val: boolean) => void
  onSortChange: (val: string) => void
  onSave: () => void
  onVirtualChange: (val: boolean) => void
  productGraphqlFilters: IProductFieldFilterInput
}

function ProductsContainer(props: IProps): JSX.Element {
  const {
    catConf,
    catalog,
    catalogsData,
    category,
    disableBtnSave,
    error,
    isSaving,
    localizedCatalog,
    onNameChange,
    onSave,
    onSortChange,
    onVirtualChange,
    productGraphqlFilters,
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

  const [listproductsPinedHooks, setListproductsPinedHooks] = useState([])
  const [listproductsUnPinedHooks, setListproductsUnPinedHooks] = useState([])

  function pinToUnPin(): void {
    if (bottomSelectedRows.length + listproductsPinedHooks.length > 25) return

    const unPinToPin = listproductsPinedHooks.filter((el: any) => {
      return topSelectedRows.indexOf(el.id) === -1
    })

    const pinToUnPin = listproductsPinedHooks.filter((el: any) => {
      return topSelectedRows.indexOf(el.id) !== -1
    })

    setListproductsPinedHooks(unPinToPin)
    setListproductsUnPinedHooks(listproductsUnPinedHooks.concat(pinToUnPin))
    setTopSelectedRows([])
  }

  function unPinToPin(): void {
    const pinToUnPin = listproductsUnPinedHooks.filter((el: any) => {
      return bottomSelectedRows.indexOf(el.id) === -1
    })

    const unPinToPin = listproductsUnPinedHooks.filter((el: any) => {
      return bottomSelectedRows.indexOf(el.id) !== -1
    })

    setListproductsUnPinedHooks(pinToUnPin)
    setListproductsPinedHooks(
      listproductsPinedHooks.concat(
        unPinToPin.map((item, key) => {
          return { ...item, position: listproductsPinedHooks.length + 1 + key }
        })
      )
    )
    setBottomSelectedRows([])
  }

  const [
    savePositionsCategoryProductMerchandising,
    setSavePositionsCategoryProductMerchandising,
  ] = useState([])

  useEffect(() => {
    const savePositionsCategory = listproductsPinedHooks.map((item, key) => {
      return { productId: Number(item.id.split('/')[2]), position: 1 + key }
    })
    return setSavePositionsCategoryProductMerchandising(savePositionsCategory)
  }, [listproductsPinedHooks])

  // const variables = useMemo(
  //   () => ({
  //     categoryId: category.id,
  //     savePositionsCategory: JSON.stringify(
  //       savePositionsCategoryProductMerchandising
  //     ),
  //   }),
  //   []
  // )

  // const options = useMemo(
  //   () => ({
  //     headers: { Authorization: `Bearer ${storageGet(tokenStorageKey)}` },
  //   }),
  //   [storageGet(tokenStorageKey)]
  // )

  // const [listProductsIdPined] = useGraphqlApi<any>(
  //   savePositions,
  //   variables,
  //   options
  // )

  if (error || !catalogsData) {
    return null
  }

  return (
    <Box>
      <div>SAVE AAAA</div>
      <Layout>
        <PageTitle
          sticky
          sx={{ marginBottom: '12px' }}
          title={category?.name ? category?.name : category?.catalogName}
        >
          <Button disabled={disableBtnSave} onClick={onSave} loading={isSaving}>
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
          setListproductsPinedHooks={setListproductsPinedHooks}
          listproductsPinedHooks={listproductsPinedHooks}
          listproductsUnPinedHooks={listproductsUnPinedHooks}
          setListproductsUnPinedHooks={setListproductsUnPinedHooks}
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
              bottomSelectedRows.length + listproductsPinedHooks.length > 25
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
