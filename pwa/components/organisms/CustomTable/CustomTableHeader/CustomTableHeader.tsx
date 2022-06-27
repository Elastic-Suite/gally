import { TableCell, TableHead, TableRow } from '@mui/material'
import { StickyTableCell } from '~/components/organisms/CustomTable/CustomTable.styled'
import { MassiveSelectionType } from '~/types'
import MassiveSelection from '../../../molecules/CustomTable/MassiveSelection/MassiveSelection'

interface IProps {
  tableHeaders: string[]
  onMassiveSelection?: (selection: MassiveSelectionType) => void
  massiveSelectionState?: boolean
}

const CustomTableHeader = (props: IProps) => {
  const { tableHeaders, onMassiveSelection, massiveSelectionState } = props

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: 'neutral.light' }}>
        {onMassiveSelection && (
          <StickyTableCell
            sx={{
              backgroundColor: 'neutral.light',
              // width an min-width related to styled component TableContainerWithCustomScrollbar
              width: '100px',
              minWidth: '100px',
            }}
            key={'header-massiveselection'}
          >
            <MassiveSelection
              onSelection={onMassiveSelection}
              selectionState={massiveSelectionState}
            />
          </StickyTableCell>
        )}

        {tableHeaders.map((header) => (
          <TableCell
            sx={{
              backgroundColor: 'neutral-light',
            }}
            key={header}
          >
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default CustomTableHeader
