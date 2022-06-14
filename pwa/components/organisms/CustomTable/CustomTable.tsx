import { useState, useEffect } from 'react'

import { ThemeProvider } from '@mui/material'

import regularTheme from '~/components/atoms/RegularTheme'
import StickyBar from '~/components/molecules/CustomTable/StickyBar/StickyBar'
import {
  StyledTable,
  TableContainerWithCustomScrollbar,
} from '~/components/organisms/CustomTable/CustomTable.styled'
import CustomTableBody from '~/components/organisms/CustomTable/CustomTableBody/CustomTableBody'
import CustomTableHeader from '~/components/organisms/CustomTable/CustomTableHeader/CustomTableHeader'

import { MassiveSelectionType, ITableRow } from '~/types'

interface IProps {
  tableHeaders: string[]
  tableRows: ITableRow[]
  onMassiveAction?: (action: string) => void
}

const CustomTable = (props: IProps) => {
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
      (selectedRows && selectedRows.length > 0 ? true : false) ||
      (currentMassiveSelection !== MassiveSelectionType.NONE ? true : false)

    handleMassiveSelection = (selection: MassiveSelectionType) => {
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
    <ThemeProvider theme={regularTheme}>
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
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
          />
        </StyledTable>
      </TableContainerWithCustomScrollbar>
      {onMassiveAction && (
        <StickyBar
          show={showStickyBar}
          onMassiveSelection={handleMassiveSelection}
          massiveSelectionState={massiveSelectionState}
        />
      )}
    </ThemeProvider>
  )
}

export default CustomTable
