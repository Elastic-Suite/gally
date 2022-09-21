import { ChangeEvent, MouseEvent, ReactNode } from 'react'
import {
  Box,
  IconButtonProps,
  LabelDisplayedRowsArgs,
  SelectProps,
  TablePagination,
} from '@mui/material'
import { styled } from '@mui/system'
import { useTranslation } from 'next-i18next'
import { theme } from 'shared'

interface IPaginationStyle {
  color: string
  fontFamily: string
  fontSize: string
  lineHeight: string
}

const paginationStyle: IPaginationStyle = {
  color: theme.palette.colors.neutral[600],
  fontFamily: 'inter',
  fontSize: '12px',
  lineHeight: '18px',
}

const PaginationTextContainer = styled('span')({
  ...paginationStyle,
})

interface IProps {
  isBottom?: boolean
  count: number
  currentPage: number
  rowsPerPage: number
  rowsPerPageOptions: number[]
  onRowsPerPageChange?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  onPageChange: (page: number) => void
}

function Pagination(props: IProps): JSX.Element {
  const {
    isBottom,
    count,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onRowsPerPageChange,
    onPageChange,
  } = props

  const { t } = useTranslation('common')

  function handlePageChange(
    _: MouseEvent<HTMLButtonElement> | null,
    page: number
  ): void {
    onPageChange(page)
  }

  function labelDisplayedRows(
    paginationInfo: LabelDisplayedRowsArgs
  ): ReactNode {
    return (
      <PaginationTextContainer>
        {`${paginationInfo.from} - ${paginationInfo.to} ${t('pagination.of')} ${
          paginationInfo.count
        }`}
      </PaginationTextContainer>
    )
  }

  const labelRowsPerPage = (
    <PaginationTextContainer>
      {' '}
      {t('pagination.rowsPerPage')}
    </PaginationTextContainer>
  )

  const selectProps: Partial<SelectProps<null>> = {
    SelectDisplayProps: {
      style: {
        ...paginationStyle,
      },
    },
  }

  const nextAndBackButtonProps: Partial<IconButtonProps<'button', unknown>> = {
    sx: { color: theme.palette.colors.neutral['900'] },
  }

  return (
    <Box
      sx={{
        ...(isBottom && {
          borderRadius: '0 0 8px 8px',
        }),
        ...(!isBottom && {
          borderRadius: '8px 8px 0 0',
        }),
        bgcolor: 'colors.white',
      }}
    >
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={count}
        page={currentPage}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        labelDisplayedRows={labelDisplayedRows}
        labelRowsPerPage={labelRowsPerPage}
        SelectProps={selectProps}
        nextIconButtonProps={nextAndBackButtonProps}
        backIconButtonProps={nextAndBackButtonProps}
      />
    </Box>
  )
}

export default Pagination
