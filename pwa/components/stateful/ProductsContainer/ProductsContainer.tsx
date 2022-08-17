import { Box, styled } from '@mui/system'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ITreeItem } from '~/types'

import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'
import TertiaryButton from '~/components/atoms/buttons/TertiaryButton'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import PageTile from '~/components/atoms/PageTitle/PageTitle'
import StickyBar from '~/components/molecules/CustomTable/StickyBar/StickyBar'
import ProductsTopAndBottom from '~/components/stateful/ProductsTopAndBottom/ProductsTopAndBottom'
import Merchandize from '../Merchandize/Merchandize'

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
  category: ITreeItem
  handleVirtuel: () => void
  virtualCat: boolean
}

function ProductsContainer(props: IProps): JSX.Element {
  const { category, virtualCat, handleVirtuel } = props

  const tableRef = useRef<HTMLDivElement>()
  const [topSelectedRows, setTopSelectedRows] = useState<string[]>([])
  const [bottomSelectedRows, setBottomSelectedRows] = useState<string[]>([])

  const { t } = useTranslation('categories')

  const showStickyBar =
    Boolean(topSelectedRows && topSelectedRows.length > 0) ||
    Boolean(bottomSelectedRows && bottomSelectedRows.length > 0)

  function unselectAllRows(): void {
    setTopSelectedRows([])
    setBottomSelectedRows([])
  }

  /* args sort category / virtuel C */

  // const [virtualCat, setVirtualCat] = useState(true)
  const [catNameChange, setCatNameChange] = useState(false)
  const [valSorting, setValSorting] = useState(10)

  const handleChange = (val: number): void => {
    setValSorting(val)
  }

  return (
    <Box>
      <Layout>
        <PageTile
          title={category?.name ? category?.name : category?.catalogName}
          sx={{ marginBottom: '12px' }}
        />
        {/* todo: add sort and category / virtual category toggle */}

        <Merchandize
          onVirtualCategoryChange={handleVirtuel}
          virtualCategoryValue={virtualCat}
          onCategoryNameChange={setCatNameChange}
          categoryNameValue={catNameChange}
          {...{
            args: {
              disabled: false,
              label: 'Default sorting',
              value: 10,
              options: [
                { label: 'Position', value: 10 },
                { label: 'Product Name', value: 20 },
                { label: 'Price', value: 30 },
                { label: 'Performance', value: 40 },
              ],
              required: false,
            },
          }}
          {...{ onChange: handleChange, value: valSorting }}
        />

        {/* todo : add search bar */}

        <ProductsTopAndBottom
          ref={tableRef}
          topSelectedRows={topSelectedRows}
          onTopSelectedRows={setTopSelectedRows}
          bottomSelectedRows={bottomSelectedRows}
          onBottomSelectedRows={setBottomSelectedRows}
        />
      </Layout>
      <StickyBar positionRef={tableRef} show={showStickyBar}>
        {t('rows.selected', {
          count: topSelectedRows.length + bottomSelectedRows.length,
        })}
        <ActionsButtonsContainer>
          <TertiaryButton onClick={(): void => unselectAllRows()}>
            {t('button.cancelSelection')}
          </TertiaryButton>
          <PrimaryButton
            sx={{ marginLeft: 1 }}
            disabled={bottomSelectedRows.length === 0}
          >
            {t('pinToTop')}
            <IonIcon name="arrow-up-outline" style={{ marginLeft: '13px' }} />
          </PrimaryButton>
          <PrimaryButton
            sx={{ marginLeft: 1 }}
            disabled={topSelectedRows.length === 0}
          >
            {t('pinToBottom')}
            <IonIcon name="arrow-down-outline" style={{ marginLeft: '13px' }} />
          </PrimaryButton>
        </ActionsButtonsContainer>
      </StickyBar>
    </Box>
  )
}

export default ProductsContainer
