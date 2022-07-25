import { ChangeEvent, MouseEvent } from 'react'
import { styled } from '@mui/system'

import Pagination from '~/components/molecules/CustomTable/Pagination/Pagination'
import CustomTable, {
  IProps as ICustomTableProps,
} from '~/components/organisms/CustomTable/CustomTable'

const Root = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.colors.neutral[300]}`,
}))

interface IProps extends ICustomTableProps {
  currentPage: number
  onPageChange: (
    event: MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void
  onRowsPerPageChange?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  rowsPerPage: number
  rowsPerPageOptions: number[]
  totalPages: number
}

function PagerTable(props: IProps): JSX.Element {
  const {
    currentPage,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPage,
    rowsPerPageOptions,
    totalPages,
    ...tableProps
  } = props

  return (
    <Root>
      <Pagination
        currentPage={currentPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        totalPages={totalPages}
      />
      <CustomTable {...tableProps} />
      <Pagination
        currentPage={currentPage}
        isBottom
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        totalPages={totalPages}
      />
    </Root>
  )
}

export default PagerTable
