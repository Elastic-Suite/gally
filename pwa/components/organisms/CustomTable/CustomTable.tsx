import { useEffect, useState } from 'react'

import StickyBar from '~/components/molecules/CustomTable/StickyBar/StickyBar'
import {
  StyledTable,
  TableContainerWithCustomScrollbar,
} from '~/components/organisms/CustomTable/CustomTable.styled'
import CustomTableBody from '~/components/organisms/CustomTable/CustomTableBody/CustomTableBody'
import CustomTableHeader from '~/components/organisms/CustomTable/CustomTableHeader/CustomTableHeader'

import { ITableHeader, ITableRow, MassiveSelectionType } from '~/types'

interface IProps {
  tableHeaders: ITableHeader[]
  tableRows: ITableRow[]
  onMassiveAction?: (action: string) => void
}

function CustomTable(props: IProps): JSX.Element {
  const { tableHeaders, tableRows, onMassiveAction } = props
  const [selectedRows, setSelectedRows] = useState<string[]>(null)

  const [currentMassiveSelection, setCurrentMassiveSelection] = useState(
    MassiveSelectionType.NONE
  )

  const allowMassiveSelection = Boolean(onMassiveAction)

  let handleMassiveSelection = null
  let massiveSelectionState = null
  let showStickyBar = null
  if (allowMassiveSelection) {
    // TODO : add intermediate state
    massiveSelectionState = selectedRows
      ? selectedRows.length === tableRows.length
      : false

    showStickyBar =
      Boolean(selectedRows && selectedRows.length > 0) ||
      currentMassiveSelection !== MassiveSelectionType.NONE

    handleMassiveSelection = (selection: MassiveSelectionType): void => {
      setCurrentMassiveSelection(selection)
      switch (selection) {
        case MassiveSelectionType.ALL:
        case MassiveSelectionType.ALL_ON_CURRENT_PAGE:
          return setSelectedRows(tableRows.map((row) => row.id))
        case MassiveSelectionType.NONE:
          return setSelectedRows([])
      }
    }
  }

  useEffect(() => {
    if (allowMassiveSelection) {
      setSelectedRows([])
    }
  }, [allowMassiveSelection])

  return (
    <>
      <TableContainerWithCustomScrollbar
        sx={{
          ...(onMassiveAction && {
            '&::-webkit-scrollbar-track': {
              marginLeft: '100px',
            },
            '&::-webkit-scrollbar-thumb': {
              marginLeft: '100px',
            },
          }),
        }}
      >
        <StyledTable>
          <CustomTableHeader
            tableHeaders={tableHeaders}
            onMassiveSelection={handleMassiveSelection}
            massiveSelectionState={massiveSelectionState}
          />
          <CustomTableBody
            tableRows={tableRows}
            tableHeaders={tableHeaders}
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
          />
        </StyledTable>
      </TableContainerWithCustomScrollbar>
      {onMassiveAction ? (
        <StickyBar
          show={showStickyBar}
          onMassiveSelection={handleMassiveSelection}
          massiveSelectionState={massiveSelectionState}
        />
      ) : null}
    </>
  )
}

export default CustomTable
