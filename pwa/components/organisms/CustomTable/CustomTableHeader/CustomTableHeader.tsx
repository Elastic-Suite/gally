import { TableCell, TableHead, TableRow } from '@mui/material'
import { StickyTableCell } from '~/components/organisms/CustomTable/CustomTable.styled'
import { ITableHeader, MassiveSelectionType } from '~/types'
import MassiveSelection from '../../../molecules/CustomTable/MassiveSelection/MassiveSelection'

interface IProps {
  tableHeaders: ITableHeader[]
  onMassiveSelection?: (selection: MassiveSelectionType) => void
  massiveSelectionState?: boolean
}

function CustomTableHeader(props: IProps): JSX.Element {
  const { tableHeaders, onMassiveSelection, massiveSelectionState } = props

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: 'neutral.light' }}>
        {onMassiveSelection ? (
          <StickyTableCell
            sx={{
              backgroundColor: 'neutral.light',
              // width an min-width related to styled component TableContainerWithCustomScrollbar
              width: '100px',
              minWidth: '100px',
            }}
            key="header-massiveselection"
          >
            <MassiveSelection
              onSelection={onMassiveSelection}
              selectionState={massiveSelectionState}
            />
          </StickyTableCell>
        ) : null}

        {tableHeaders.map((header) => (
          <TableCell
            sx={{
              backgroundColor: 'neutral-light',
              whiteSpace: 'nowrap',
            }}
            key={header.field}
          >
            {header.headerName}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default CustomTableHeader
