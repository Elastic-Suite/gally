import {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  MutableRefObject,
  SetStateAction,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

import { useIsHorizontalOverflow } from '~/hooks'
import {
  IFieldGuesserProps,
  ITableHeader,
  ITableRow,
  reorderingColumnWidth,
  selectionColumnWidth,
  stickyColunWidth,
} from 'shared'

import {
  StyledTable,
  TableContainerWithCustomScrollbar,
} from '~/components/organisms/CustomTable/CustomTable.styled'
import DraggableBody from '~/components/organisms/CustomTable/CustomTableBody/DraggableBody'
import NonDraggableBody from '~/components/organisms/CustomTable/CustomTableBody/NonDraggableBody'
import CustomTableHeader from '~/components/organisms/CustomTable/CustomTableHeader/CustomTableHeader'

export interface ICustomTableProps {
  Field: FunctionComponent<IFieldGuesserProps>
  draggable?: boolean
  onReorder?: (rows: ITableRow[]) => void
  onRowUpdate?: (
    id: string | number,
    name: string,
    value: boolean | number | string
  ) => void
  tableHeaders: ITableHeader[]
  tableRows: ITableRow[]
  selectedRows?: (string | number)[]
  onSelectedRows?: Dispatch<SetStateAction<(string | number)[]>>
}

function CustomTable(
  props: ICustomTableProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    Field,
    draggable,
    onReorder,
    onRowUpdate,
    tableHeaders,
    tableRows,
    selectedRows,
    onSelectedRows,
  } = props

  const [scrollLength, setScrollLength] = useState<number>(0)
  const tableRef = useRef<HTMLDivElement>()
  const { isOverflow, shadow } = useIsHorizontalOverflow(
    // eslint-disable-next-line react/destructuring-assignment
    ref?.current ?? tableRef.current
  )

  /**
   * Compute the length of the sticky part.
   * For now, each sticky colun have a fixed width of 200px but it could ( maybe should ) be improve by seeting an array of width provide by props if needed.
   */
  const stickyLength =
    tableHeaders.filter((header) => header.sticky).length * stickyColunWidth

  const withSelection = selectedRows?.length !== undefined

  let onSelection = null
  let massiveSelectionState = null
  let massiveSelectionIndeterminate = false
  if (withSelection) {
    massiveSelectionState = selectedRows
      ? selectedRows.length === tableRows.length
      : false

    massiveSelectionIndeterminate =
      selectedRows.length > 0 ? selectedRows.length < tableRows.length : false

    onSelection = (e: ChangeEvent<HTMLInputElement>): void => {
      e.target.checked
        ? onSelectedRows(tableRows.map((row) => row.id))
        : onSelectedRows([])
    }
  }

  let handleDragEnd = null
  if (draggable) {
    handleDragEnd = (e: DropResult): void => {
      if (!e.destination) return
      const tempData = Array.from(tableRows)
      const [source_data] = tempData.splice(e.source.index, 1)
      tempData.splice(e.destination.index, 0, source_data)
      onReorder(tempData)
    }
  }

  /**
   * Compute the CSS left values for the sticky part of the table.
   * It return an array of all successive left value to use in CustomTableHeader.tsx, DraggableTableRow.tsx and CustomTableRows.tsx
   * It gonna be provide to each row component.
   */
  function computeLeftCSSValues(): number[] {
    const stickyHeaders = tableHeaders.filter((header) => header.sticky)
    const result: number[] = [0]
    let eachLeftvalues: number[] = [0]
    eachLeftvalues.push(reorderingColumnWidth)

    if (withSelection) {
      eachLeftvalues.push(selectionColumnWidth)
    }
    if (stickyHeaders.length > 0) {
      eachLeftvalues = eachLeftvalues.concat(
        Array(stickyHeaders.length).fill(stickyColunWidth)
      )
    }
    eachLeftvalues.reduce(
      (leftPrevious, leftCurrent, i) => (result[i] = leftPrevious + leftCurrent)
    )
    return result
  }
  const cssLeftValues = computeLeftCSSValues()

  useEffect(() => {
    if (withSelection) {
      setScrollLength(
        selectionColumnWidth + stickyLength + reorderingColumnWidth
      )
    } else {
      setScrollLength(stickyLength + reorderingColumnWidth)
    }
  }, [withSelection, stickyLength, draggable])

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <TableContainerWithCustomScrollbar
          ref={ref ?? tableRef}
          sx={{
            '&::-webkit-scrollbar-track': {
              marginLeft: `${scrollLength}px`,
            },
            '&::-webkit-scrollbar-thumb': {
              marginLeft: `${scrollLength}px`,
            },
          }}
        >
          <StyledTable>
            <CustomTableHeader
              tableHeaders={tableHeaders}
              withSelection={withSelection}
              onSelection={onSelection}
              massiveSelectionState={massiveSelectionState}
              cssLeftValues={cssLeftValues}
              isHorizontalOverflow={isOverflow}
              shadow={shadow}
              massiveSelectionIndeterminate={massiveSelectionIndeterminate}
            />
            {Boolean(!draggable) && (
              <NonDraggableBody
                Field={Field}
                tableRows={tableRows}
                onRowUpdate={onRowUpdate}
                tableHeaders={tableHeaders}
                withSelection={withSelection}
                onSelectRows={onSelectedRows}
                selectedRows={selectedRows}
                cssLeftValues={cssLeftValues}
                isHorizontalOverflow={isOverflow}
                shadow={shadow}
              />
            )}
            {Boolean(draggable) && (
              <DraggableBody
                Field={Field}
                tableRows={tableRows}
                onRowUpdate={onRowUpdate}
                tableHeaders={tableHeaders}
                withSelection={withSelection}
                onSelectRows={onSelectedRows}
                selectedRows={selectedRows}
                cssLeftValues={cssLeftValues}
                isHorizontalOverflow={isOverflow}
                shadow={shadow}
              />
            )}
          </StyledTable>
        </TableContainerWithCustomScrollbar>
      </DragDropContext>
    </>
  )
}

export default forwardRef(CustomTable)
