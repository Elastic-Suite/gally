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
  isValid?: boolean
  localizedCatalogId: string
  onChange: (name: string, val: boolean | string) => void
  onSave: (result: string) => void
  prevCatConf: MutableRefObject<IParsedCategoryConfiguration>
  prevProductPositions: MutableRefObject<string>
  productGraphqlFilters: IProductFieldFilterInput
}

function ProductsContainer(props: IProps): JSX.Element {
  const {
    catConf,
    category,
    isLoading,
    isValid,
    localizedCatalogId,
    onChange,
    onSave,
    prevCatConf,
    prevProductPositions,
    productGraphqlFilters,
  } = props

  const tableRef = useRef<HTMLDivElement>()
  const [topSelectedRows, setTopSelectedRows] = useState<string[]>([])
  const [bottomSelectedRows, setBottomSelectedRows] = useState<string[]>([])
  const [nbBottomRows, setNbBottomRows] = useState(0)

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
    : [{ label: 'Position', value: 'category__position' }]

  const [search, setSearch] = useState('')
  function onSearch(value: string): void {
    setSearch(value)
  }

  const [valSearchOnChange, setValSearchOnChange] = useState('')
  function onValSearchOnChange(value: string): void {
    setValSearchOnChange(value)
  }

  const topProducts = productPositions.data
    ? (JSON.parse(
        productPositions.data.getPositionsCategoryProductMerchandising.result
      ) as IProductPositions)
    : []

  const dirty =
    prevCatConf.current &&
    catConf &&
    prevProductPositions.current &&
    productPositions.data
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
  const disabled = !dirty || !isValid

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
    onSearch('')
    onValSearchOnChange('')
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
    onSearch('')
    onValSearchOnChange('')
  }

  function handleSave(): void {
    onSave(
      defaultSorting === 'category__position'
        ? productPositions.data.getPositionsCategoryProductMerchandising.result
        : '[]'
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
          <Button disabled={disabled} onClick={handleSave} loading={isLoading}>
            {t('buttonSave')}
          </Button>
        </PageTitle>
        {Boolean(catConf) && (
          <Merchandize
            catConf={catConf}
            onChange={onChange}
            sortOptions={sortOption}
          />
        )}

        <SearchBar
          nbResults={nbBottomRows}
          nbTopProducts={topProducts.length}
          onSearch={onSearch}
          sortValue={defaultSorting}
          searchValue={valSearchOnChange}
          onValSearchOnChange={onValSearchOnChange}
        />
        {Boolean(
          catConf && (!catConf.virtualRule || productGraphqlFilters)
        ) && (
          <ProductsTopAndBottom
            ref={tableRef}
            bottomSelectedRows={bottomSelectedRows}
            localizedCatalogId={localizedCatalogId}
            productGraphqlFilters={productGraphqlFilters}
            onBottomSelectedRows={setBottomSelectedRows}
            onTopSelectedRows={setTopSelectedRows}
            setNbBottomRows={setNbBottomRows}
            setProductPositions={setProductPositions}
            topSelectedRows={topSelectedRows}
            topProducts={topProducts}
            sortValue={defaultSorting}
            searchValue={search}
          />
        )}
      </Layout>
      <StickyBar positionRef={tableRef} show={showStickyBar}>
        {t('rows.selected', {
          count: topSelectedRows.length + bottomSelectedRows.length,
        })}

        <CustomBarTextMaxProducts>
          {defaultSorting === 'category__position'
            ? (topProducts.length === 25 ||
                topProducts.length + bottomSelectedRows.length > 25) &&
              bottomSelectedRows.length !== 0 &&
              t('bar.textMaxProducts')
            : t('stickybar.noPositionProduct')}
        </CustomBarTextMaxProducts>
        <Button display="tertiary" onClick={(): void => unselectAllRows()}>
          {t('button.cancelSelection')}
        </Button>
        <Button
          sx={{ marginLeft: 1 }}
          disabled={
            defaultSorting !== 'category__position' ||
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
          disabled={
            defaultSorting !== 'category__position' ||
            topSelectedRows.length === 0
          }
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
