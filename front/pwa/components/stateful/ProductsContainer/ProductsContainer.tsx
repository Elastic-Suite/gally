import { Box, styled } from '@mui/system'
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ICategory,
  ICategorySortingOption,
  IGraphqlProductPosition,
  IParsedCategoryConfiguration,
  IProductFieldFilterInput,
  IProductPositions,
  LoadStatus,
  getProductPosition,
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

const CustomBarTextMaxProducts = styled('div')(({ theme }) => ({
  color: theme.palette.colors.primary['500'],
  margin: '0 auto',
}))

interface IProps {
  catConf: IParsedCategoryConfiguration
  category: ICategory
  isLoading?: boolean
  localizedCatalogId: string
  onNameChange: (val: boolean) => void
  onSortChange: (val: string) => void
  onSave: (result: string) => void
  onVirtualChange: (val: boolean) => void
  prevCatConf: MutableRefObject<IParsedCategoryConfiguration>
  prevProductPositions: MutableRefObject<string>
  productGraphqlFilters: IProductFieldFilterInput
}

function ProductsContainer(props: IProps): JSX.Element {
  const {
    catConf,
    category,
    isLoading,
    localizedCatalogId,
    onNameChange,
    onSave,
    onSortChange,
    onVirtualChange,
    prevCatConf,
    prevProductPositions,
    productGraphqlFilters,
  } = props

  const tableRef = useRef<HTMLDivElement>()
  const [topSelectedRows, setTopSelectedRows] = useState<string[]>([])
  const [bottomSelectedRows, setBottomSelectedRows] = useState<string[]>([])
  const [nbBottomRows, setNbBottomRows] = useState(0)

  const useNameInProductSearch = catConf?.useNameInProductSearch ?? false
  const isVirtual = catConf?.isVirtual ?? false
  const defaultSorting = catConf?.defaultSorting ?? ''

  const variables = useMemo(
    () => ({
      localizedCatalogId: Number(localizedCatalogId),
      categoryId: category?.id,
    }),
    [localizedCatalogId, category?.id]
  )
  const [productPositions, setProductPositions] =
    useGraphqlApi<IGraphqlProductPosition>(getProductPosition, variables)
  useEffect(() => {
    if (productPositions.status === LoadStatus.SUCCEEDED) {
      prevProductPositions.current =
        productPositions.data.getPositionsCategoryProductMerchandising.result
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productPositions.status])

  const { t } = useTranslation('categories')

  const showStickyBar =
    Boolean(topSelectedRows && topSelectedRows.length > 0) ||
    Boolean(bottomSelectedRows && bottomSelectedRows.length > 0)

  function unselectAllRows(): void {
    setTopSelectedRows([])
    setBottomSelectedRows([])
  }

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

  const topProducts = productPositions.data
    ? (JSON.parse(
        productPositions.data.getPositionsCategoryProductMerchandising.result
      ) as IProductPositions)
    : []

  const dirty =
    prevCatConf.current && prevProductPositions.current
      ? Object.entries(catConf ?? {}).some(
          ([key, val]: [key: keyof typeof catConf, val: string | boolean]) =>
            !(
              prevCatConf.current[key] === undefined ||
              prevCatConf.current[key] === val
            )
        ) ||
        prevProductPositions.current !==
          productPositions.data.getPositionsCategoryProductMerchandising.result
      : false

  function pinToTop(): void {
    if (bottomSelectedRows.length + topProducts.length > 25) return
    let maxPosition = Math.max(
      ...topProducts.map((topProduct) => topProduct.position)
    )
    const newTopProducts = bottomSelectedRows.map((row) => ({
      productId: Number(row.split('/')[2]),
      position: topProducts.length === 0 ? 1 : ++maxPosition,
    }))
    setProductPositions({
      getPositionsCategoryProductMerchandising: {
        result: JSON.stringify(topProducts.concat(newTopProducts)),
      },
    })
    setBottomSelectedRows([])
  }

  function pinToBottom(): void {
    setProductPositions({
      getPositionsCategoryProductMerchandising: {
        result: JSON.stringify(
          topProducts.filter(
            ({ productId }) =>
              !topSelectedRows.includes(`/products/${productId}`)
          )
        ),
      },
    })
    setTopSelectedRows([])
  }

  function handleSave(): void {
    onSave(
      productPositions.data.getPositionsCategoryProductMerchandising.result
    )
  }

  return (
    <Box>
      <Layout>
        <PageTitle
          sticky
          sx={{ marginBottom: '12px' }}
          title={category?.name ? category?.name : category?.catalogName}
        >
          <Button disabled={!dirty} onClick={handleSave} loading={isLoading}>
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
          nbResults={nbBottomRows}
          nbTopProducts={topProducts.length}
          value={searchValue}
          onChange={onSearchChange}
        />

        <ProductsTopAndBottom
          ref={tableRef}
          bottomSelectedRows={bottomSelectedRows}
          localizedCatalogId={localizedCatalogId}
          productGraphqlFilters={productGraphqlFilters}
          onBottomSelectedRows={setBottomSelectedRows}
          onTopSelectedRows={setTopSelectedRows}
          setProductPositions={setProductPositions}
          topSelectedRows={topSelectedRows}
          topProducts={topProducts}
          setNbBottomRows={setNbBottomRows}
        />
      </Layout>
      <StickyBar positionRef={tableRef} show={showStickyBar}>
        {t('rows.selected', {
          count: topSelectedRows.length + bottomSelectedRows.length,
        })}

        <CustomBarTextMaxProducts>
          {(topProducts.length === 25 ||
            topProducts.length + bottomSelectedRows.length > 25) &&
            bottomSelectedRows.length !== 0 &&
            t('bar.textMaxProducts')}
        </CustomBarTextMaxProducts>
        <Button display="tertiary" onClick={(): void => unselectAllRows()}>
          {t('button.cancelSelection')}
        </Button>
        <Button
          sx={{ marginLeft: 1 }}
          disabled={
            bottomSelectedRows.length === 0 ||
            bottomSelectedRows.length + topProducts.length > 25
          }
          onClick={pinToTop}
        >
          {t('pinToTop')}
          <IonIcon name="arrow-up-outline" style={{ marginLeft: '13px' }} />
        </Button>
        <Button
          sx={{ marginLeft: 1 }}
          disabled={topSelectedRows.length === 0}
          onClick={pinToBottom}
        >
          {t('pinToBottom')}
          <IonIcon name="arrow-down-outline" style={{ marginLeft: '13px' }} />
        </Button>
      </StickyBar>
    </Box>
  )
}

export default ProductsContainer
