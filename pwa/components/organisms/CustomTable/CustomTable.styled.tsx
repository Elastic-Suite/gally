import { TableContainer, TableCell, Table } from '@mui/material'
import { styled } from '@mui/system'

export const TableContainerWithCustomScrollbar = styled(TableContainer)(
  ({ theme }) => ({
    '&::-webkit-scrollbar': {
      height: '4px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: `${theme.palette.colors.white}`,
      top: '15px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: `${theme.palette.neutral.main}`,
      borderRadius: '15px',
      top: '15px',
    },
  })
)

export const StyledTable = styled(Table)({
  tableLayout: 'auto',
  width: '100%',
  height: '100%',
  borderCollapse: 'separate',
})

export const StickyTableCell = styled(TableCell)({
  position: 'sticky',
  left: 0,
  padding: 0,
  height: '100%',
  borderRight: '1px solid black',
})
