import {
  ChangeEvent,
  FunctionComponent,
  MutableRefObject,
  SyntheticEvent,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

import { useIsHorizontalOverflow } from '~/hooks'
import {
  IFieldGuesserProps,
  ITableConfig,
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
  border?: boolean
  diffRows?: ITableRow[]
  draggable?: boolean
  massiveSelectionState?: boolean
  massiveSelectionIndeterminate?: boolean
  onReOrder?: (rows: ITableRow[]) => void
  onRowUpdate?: (
    id: string | number,
    name: string,
    value: boolean | number | string,
    event: SyntheticEvent
  ) => void
  onSelection?: (rowIds: (string | number)[] | boolean) => void
  selectedRows?: (string | number)[]
  tableConfigs?: ITableConfig[]
  tableHeaders: ITableHeader[]
  tableRows: ITableRow[]
  withSelection?: boolean
}

function CustomTable(
  props: ICustomTableProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    Field,
    border,
    diffRows,
    draggable,
    massiveSelectionState,
    massiveSelectionIndeterminate,
    onReOrder,
    onRowUpdate,
    onSelection,
    tableConfigs,
    tableHeaders,
    tableRows,
    selectedRows,
    withSelection,
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

  let handleDragEnd = null
  if (draggable) {
    handleDragEnd = (e: DropResult): void => {
      if (!e.destination) return
      const tempData = Array.from(tableRows)
      const [source_data] = tempData.splice(e.source.index, 1)
      tempData.splice(e.destination.index, 0, source_data)
      onReOrder?.(tempData)
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

  const styles = border
    ? {
        border: '2px solid #ED7465',
        borderTop: 'none',
        borderRadius: '0px 0px 8px 8px',
        boxSizing: 'border-box',
      }
    : {}

  function handleSelection(event: ChangeEvent<HTMLInputElement>): void {
    onSelection(event.target.checked)
  }

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
            ...styles,
          }}
        >
          <StyledTable stickyHeader>
            <CustomTableHeader
              cssLeftValues={cssLeftValues}
              isHorizontalOverflow={isOverflow}
              massiveSelectionIndeterminate={massiveSelectionIndeterminate}
              massiveSelectionState={massiveSelectionState}
              onSelection={handleSelection}
              shadow={shadow}
              tableHeaders={tableHeaders}
              withSelection={withSelection}
            />
            {Boolean(!draggable) && (
              <NonDraggableBody
                Field={Field}
                cssLeftValues={cssLeftValues}
                diffRows={diffRows}
                isHorizontalOverflow={isOverflow}
                onRowUpdate={onRowUpdate}
                onSelectRows={onSelection}
                selectedRows={selectedRows}
                shadow={shadow}
                tableConfigs={tableConfigs}
                tableHeaders={tableHeaders}
                tableRows={tableRows}
                withSelection={withSelection}
              />
            )}
            {Boolean(draggable) && (
              <DraggableBody
                Field={Field}
                cssLeftValues={cssLeftValues}
                diffRows={diffRows}
                isHorizontalOverflow={isOverflow}
                onRowUpdate={onRowUpdate}
                onSelectRows={onSelection}
                selectedRows={selectedRows}
                shadow={shadow}
                tableConfigs={tableConfigs}
                tableHeaders={tableHeaders}
                tableRows={tableRows}
                withSelection={withSelection}
              />
            )}
          </StyledTable>
        </TableContainerWithCustomScrollbar>
      </DragDropContext>
    </>
  )
}

export default forwardRef(CustomTable)
