import { Box } from '@mui/material'
import { useState } from 'react'
import DropDown, { IOptions } from '~/components/atoms/form/DropDown'
import { DataContentType, ITableHeader, ITableRow } from '~/types'

interface IProps {
  header: ITableHeader
  row: ITableRow
  onRowUpdate: (row: ITableRow) => void
}

const EditableContent = (props: IProps) => {
  const { header, row, onRowUpdate } = props

  const [currentRow, setCurrentRow] = useState<ITableRow>(row)

  const handleChange = (value) => {
    currentRow[header.field] = value
    setCurrentRow(currentRow)
    onRowUpdate(currentRow)
  }

  const defaultOption: IOptions = [
    {
      label: 'no label provided',
      value: -99,
    },
  ]

  const rowDisplayAccordingToType = (header: ITableHeader) => {
    switch (header.type) {
      case DataContentType.DROPDOWN:
        return (
          <Box>
            <DropDown
              options={header.options ? header.options : defaultOption}
              value={currentRow[header.field] as number}
              onChange={handleChange}
            />
          </Box>
        )
    }
  }

  return <>{rowDisplayAccordingToType(header)}</>
}

export default EditableContent
