import { Box, styled } from '@mui/system'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'
import TertiaryButton from '~/components/atoms/buttons/TertiaryButton'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import PageTile from '~/components/atoms/PageTitle/PageTitle'
import StickyBar from '~/components/molecules/CustomTable/StickyBar/StickyBar'
import ProductsTopAndBottom from '~/components/organisms/ProductsTopAndBottom/ProductsTopAndBottom'
import { ITreeItem } from '~/types'

const Layout = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  marginLeft: '32px',
  marginRight: '28px',
}))

const CustomSpan = styled('span')({
  display: 'flex',
  alignItems: 'center',
  fontFamily: 'inter',
  marginLeft: '35px',
})

const ActionsButtonsContainer = styled(Box)({
  marginLeft: 'auto',
})
interface IProps {
  category: ITreeItem
}

function ProductsContainer(props: IProps): JSX.Element {
  const { category } = props

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

  return (
    <Box>
      <Layout>
        <PageTile
          title={category?.name ? category?.name : category?.catalogName}
          sx={{ marginBottom: '12px' }}
        />

        {/* todo: add sort and category / virtual category toggle */}

        {/* todo : add search bar */}

        <ProductsTopAndBottom
          topSelectedRows={topSelectedRows}
          setTopSelectedRows={setTopSelectedRows}
          bottomSelectedRows={bottomSelectedRows}
          setBottomSelectedRows={setBottomSelectedRows}
        />
      </Layout>
      <StickyBar show={showStickyBar}>
        <>
          <CustomSpan>
            {' '}
            {topSelectedRows.length + bottomSelectedRows.length}{' '}
            {t('rows.selected')}{' '}
          </CustomSpan>
          <ActionsButtonsContainer>
            <TertiaryButton
              sx={{
                margin: '10px 8px 10px auto',
                padding: '8px 12px 8px 12px',
              }}
              onClick={(): void => unselectAllRows()}
            >
              {t('button.cancel')}
            </TertiaryButton>
            <PrimaryButton
              sx={{
                margin: '10px 32px 10px 8px',
              }}
              disabled={bottomSelectedRows.length === 0}
            >
              {t('pinToTop')}
              <IonIcon name="arrow-up-outline" style={{ marginLeft: '13px' }} />
            </PrimaryButton>

            <PrimaryButton
              sx={{
                margin: '10px 32px 10px 8px',
              }}
              disabled={topSelectedRows.length === 0}
            >
              {t('pinToBottom')}
              <IonIcon
                name="arrow-down-outline"
                style={{ marginLeft: '13px' }}
              />
            </PrimaryButton>
          </ActionsButtonsContainer>
        </>
      </StickyBar>
    </Box>
  )
}

export default ProductsContainer
