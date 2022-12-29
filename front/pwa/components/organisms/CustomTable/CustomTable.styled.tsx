import { Table, TableCell, TableContainer } from '@mui/material'
import { styled } from '@mui/system'

import { getCustomScrollBarStyles } from 'gally-admin-shared'

export const TableContainerWithCustomScrollbar = styled(TableContainer)(
  ({ theme }) => ({
    ...getCustomScrollBarStyles(theme),
    maxHeight: '70vh',
  })
)

export const StyledTable = styled(Table)({
  tableLayout: 'auto',
  width: '100%',
  height: '100%',
  borderCollapse: 'separate',
})

export const BaseTableCell = styled(TableCell)({
  height: '40px',
  maxHeight: '80px',
  maxWidth: '20%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  verticalAlign: 'top',
})

export const StickyTableCell = styled(BaseTableCell)({
  position: 'sticky',
  left: 0,
  padding: 0,
  height: '100%',
  verticalAlign: 'middle',
  '&:last-of-type': {
    borderRight: '2px solid',
    borderRightColor: 'colors.neutral.600',
  },
})
