import { ChangeEvent, MouseEvent } from 'react'
import { Box, TablePagination } from '@mui/material'

interface IProps {
  isBottom?: boolean
  totalPages: number
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
    totalPages,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onRowsPerPageChange,
    onPageChange,
  } = props

  function handlePageChange(
    _: MouseEvent<HTMLButtonElement> | null,
    page: number
  ): void {
    onPageChange(page)
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
        count={totalPages}
        page={currentPage}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Box>
  )
}

export default Pagination
