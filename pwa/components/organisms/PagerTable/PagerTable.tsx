import { styled } from '@mui/system'
import { ChangeEvent } from 'react'

import Pagination from '~/components/molecules/CustomTable/Pagination/Pagination'
import CustomTable, {
  ICustomTableProps,
} from '~/components/organisms/CustomTable/CustomTable'

const Root = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.colors.neutral[300]}`,
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
}

function PagerTable(props: IProps): JSX.Element {
  const {
    currentPage,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPage,
    rowsPerPageOptions,
    count,
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
        count={count}
      />
      <CustomTable {...tableProps} />
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

export default PagerTable
