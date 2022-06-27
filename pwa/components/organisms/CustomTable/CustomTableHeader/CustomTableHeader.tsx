import { TableHead, TableRow } from '@mui/material'
import MassiveSelection from '~/components/molecules/CustomTable/MassiveSelection/MassiveSelection'
import {
  BaseTableCell,
  stickyBorderStyle,
  StickyTableCell,
} from '~/components/organisms/CustomTable/CustomTable.styled'
import {
  reorderingColumnWidth,
  selectionColumnWidth,
  stickyColunWidth,
} from '~/constants'
import { ITableHeader, ITableHeaderSticky, MassiveSelectionType } from '~/types'
import { manageStickyHeaders } from '../CustomTable.service'

interface IProps {
  tableHeaders: ITableHeader[]
  withSelection: boolean
  onMassiveSelection?: (selection: MassiveSelectionType) => void
  massiveSelectionState?: boolean
  draggable: boolean
  cSSLeftValues: number[]
  isHorizontalOverflow: boolean
  shadow: boolean
  massiveSelectionIndeterminate: boolean
}

<<<<<<< HEAD
function CustomTableHeader(props: IProps): JSX.Element {
  const { tableHeaders, onMassiveSelection, massiveSelectionState } = props

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: 'neutral.light' }}>
        {onMassiveSelection ? (
=======
const CustomTableHeader = (props: IProps) => {
  const {
    tableHeaders,
    withSelection,
    onMassiveSelection,
    massiveSelectionState,
    draggable,
    cSSLeftValues,
    isHorizontalOverflow,
    shadow,
    massiveSelectionIndeterminate,
  } = props

  const stickyHeaders: ITableHeaderSticky[] = manageStickyHeaders(tableHeaders)
  const isOnlyDraggable = !withSelection && stickyHeaders.length === 0
  const CSSLeftValuesIterator = cSSLeftValues.entries()

  return (
    <TableHead>
      <TableRow
        sx={{
          backgroundColor: 'neutral.light',
        }}
      >
        {draggable && (
>>>>>>> 5e22b42... feat/ESPP-213-draggable-table-design-system
          <StickyTableCell
            sx={{
              minWidth: `${reorderingColumnWidth}px`,
              backgroundColor: 'neutral.light',
              ...(!isOnlyDraggable && { borderRight: 'none' }),
              ...(isOnlyDraggable &&
                isHorizontalOverflow && { ...stickyBorderStyle(shadow) }),
              zIndex: '1',
              left: `${CSSLeftValuesIterator.next().value[1]}px`,
            }}
          />
        )}

        {withSelection && (
          <StickyTableCell
            sx={{
              backgroundColor: 'neutral.light',
              width: `${selectionColumnWidth}px`,
              minWidth: `${selectionColumnWidth}px`,
              left: `${CSSLeftValuesIterator.next().value[1]}px`,
              ...(isHorizontalOverflow &&
                stickyHeaders.length === 0 && { ...stickyBorderStyle(shadow) }),
            }}
            key="header-massiveselection"
          >
            <MassiveSelection
              onSelection={onMassiveSelection}
              selectionState={massiveSelectionState}
              indeterminateState={massiveSelectionIndeterminate}
            />
          </StickyTableCell>
        ) : null}

        {stickyHeaders.map((stickyHeader) => (
          <StickyTableCell
            key={stickyHeader.field}
            sx={{
              left: `${CSSLeftValuesIterator.next().value[1]}px`,
              backgroundColor: 'neutral.light',
              zIndex: '1',
              minWidth: `${stickyColunWidth}px`,
              borderLeft: 'none',
              ...(stickyHeader.isLastSticky && {
                ...stickyBorderStyle(shadow),
              }),
            }}
          >
            {stickyHeader.headerName}
          </StickyTableCell>
        ))}

        {tableHeaders
          .filter((header) => !header.sticky)
          .map((header) => (
            <BaseTableCell
              sx={{
                backgroundColor: 'neutral-light',
                whiteSpace: 'nowrap',
              }}
              key={header.field}
            >
              {header.headerName}
            </BaseTableCell>
          ))}
      </TableRow>
    </TableHead>
  )
}

export default CustomTableHeader
