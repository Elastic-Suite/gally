import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { ChangeEvent } from 'react-transition-group/node_modules/@types/react'
import {
  StyledTable,
  TableContainerWithCustomScrollbar,
} from '~/components/organisms/CustomTable/CustomTable.styled'
import DraggableBody from '~/components/organisms/CustomTable/CustomTableBody/DraggableBody'
import NonDraggableBody from '~/components/organisms/CustomTable/CustomTableBody/NonDraggableBody'
import CustomTableHeader from '~/components/organisms/CustomTable/CustomTableHeader/CustomTableHeader'
import {
  reorderingColumnWidth,
  selectionColumnWidth,
  stickyColunWidth,
} from '~/constants'
import { useIsHorizontalOverflow } from '~/hooks'
import { ITableHeader, ITableRow } from '~/types'

export interface IProps {
  draggable?: boolean
  onReorder?: (rows: ITableRow[]) => void
  onRowUpdate?: (
    id: string | number,
    field: string,
    value: boolean | number | string
  ) => void
  tableHeaders: ITableHeader[]
  tableRows: ITableRow[]
  selectedRows?: (string | number)[]
  setSelectedRows?: Dispatch<SetStateAction<(string | number)[]>>
  withSelection?: boolean
  paginated: boolean
}

function CustomTable(props: IProps): JSX.Element {
  const {
    draggable,
    onReorder,
    onRowUpdate,
    tableHeaders,
    tableRows,
    withSelection,
    selectedRows,
    setSelectedRows,
    paginated,
  } = props

  const [scrollLength, setScrollLength] = useState<number>(0)
  const tableRef = useRef<HTMLDivElement>()
  const { isOverflow, shadow } = useIsHorizontalOverflow(tableRef.current)

  /**
   * Compute the length of the sticky part.
   * For now, each sticky colun have a fixed width of 200px but it could ( maybe should ) be improve by seeting an array of width provide by props if needed.
   */
  const stickyLength =
    tableHeaders.filter((header) => header.sticky).length * stickyColunWidth

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
        ? setSelectedRows(tableRows.map((row) => row.id))
        : setSelectedRows([])
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
  const cSSLeftValues = computeLeftCSSValues()

  useEffect(() => {
    if (withSelection) {
      setScrollLength(selectionColumnWidth + stickyLength)
      if (draggable) {
        setScrollLength(
          selectionColumnWidth + reorderingColumnWidth + stickyLength
        )
      }
    } else if (draggable) {
      setScrollLength(reorderingColumnWidth)
    } else {
      setScrollLength(stickyLength)
    }
  }, [withSelection, stickyLength, draggable])

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <TableContainerWithCustomScrollbar
          ref={tableRef}
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
              cSSLeftValues={cSSLeftValues}
              isHorizontalOverflow={isOverflow}
              shadow={shadow}
              massiveSelectionIndeterminate={massiveSelectionIndeterminate}
            />
            {Boolean(!draggable) && (
              <NonDraggableBody
                tableRows={tableRows}
                onRowUpdate={onRowUpdate}
                tableHeaders={tableHeaders}
                withSelection={withSelection}
                onSelectRows={setSelectedRows}
                selectedRows={selectedRows}
                cSSLeftValues={cSSLeftValues}
                isHorizontalOverflow={isOverflow}
                shadow={shadow}
                paginated={paginated}
              />
            )}
            {Boolean(draggable) && (
              <DraggableBody
                tableRows={tableRows}
                onRowUpdate={onRowUpdate}
                tableHeaders={tableHeaders}
                withSelection={withSelection}
                onSelectRows={setSelectedRows}
                selectedRows={selectedRows}
                cSSLeftValues={cSSLeftValues}
                isHorizontalOverflow={isOverflow}
                shadow={shadow}
                paginated={paginated}
              />
            )}
          </StyledTable>
        </TableContainerWithCustomScrollbar>
      </DragDropContext>
    </>
  )
}

export default CustomTable
