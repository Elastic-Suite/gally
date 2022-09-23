import { ChangeEvent, MutableRefObject, forwardRef } from 'react'
import { styled } from '@mui/system'

import Pagination from '~/components/molecules/CustomTable/Pagination/Pagination'
import CustomTable, {
  ICustomTableProps,
} from '~/components/organisms/CustomTable/CustomTable'

import { useTranslation } from 'next-i18next'

const Root = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.colors.neutral[300]}`,
}))

const CustomNoResult = styled('div')(({ theme }) => ({
  fontFamily: 'inter',
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.colors.black,
  textAlign: 'center',
  marginTop: theme.spacing(3),
}))

interface IProps extends ICustomTableProps {
  currentPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  rowsPerPage: number
  rowsPerPageOptions: number[]
  count: number
  noResult?: boolean
}

function PagerTable(
  props: IProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    currentPage,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPage,
    rowsPerPageOptions,
    count,
    noResult,
    ...tableProps
  } = props
  const { t } = useTranslation('common')

  return (
    <Root ref={ref}>
      <Pagination
        currentPage={currentPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        count={count}
      />
      <CustomTable {...tableProps} />
      {noResult ? <CustomNoResult>{t('no.result')}</CustomNoResult> : null}
      <Pagination
        currentPage={currentPage}
        isBottom
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        count={count}
      />
    </Root>
  )
}

export default forwardRef(PagerTable)
