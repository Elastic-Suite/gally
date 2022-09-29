import { ChangeEvent, useRef, useState } from 'react'

import { useApiEditableFieldOptions, useApiHeaders } from '~/hooks'
import {
  IField,
  IHydraMember,
  IHydraResponse,
  IResource,
  IResourceEditableMassUpdate,
  ITableRow,
  defaultPageSize,
} from 'shared'

import StickyBar from '~/components/molecules/CustomTable/StickyBar/StickyBar'
import PagerTable from '~/components/organisms/PagerTable/PagerTable'

import FieldGuesser from '../FieldGuesser/FieldGuesser'
import TableStickyBar from '../TableStickyBar/TableStickyBar'

interface IProps<T extends IHydraMember> {
  apiData: IHydraResponse<T>
  currentPage?: number
  onMassupdate: IResourceEditableMassUpdate<T>
  onPageChange: (page: number) => void
  onRowUpdate?: (
    id: string | number,
    name: string,
    value: boolean | number | string
  ) => void
  prevData: T[]
  resource: IResource
  rowsPerPage?: number
  rowsPerPageOptions?: number[]
  onRowsPerPageChange?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  noResult?: boolean
}

function TableGuesser<T extends IHydraMember>(props: IProps<T>): JSX.Element {
  const {
    apiData,
    currentPage,
    onMassupdate,
    onPageChange,
    onRowUpdate,
    prevData,
    resource,
    rowsPerPage,
    rowsPerPageOptions,
    onRowsPerPageChange,
    noResult,
  } = props
  const tableHeaders = useApiHeaders(resource)
  const fieldOptions = useApiEditableFieldOptions(resource)

  const tableRef = useRef<HTMLDivElement>()
  const [selectedField, setSelectedField] = useState<IField | ''>('')
  const [selectedValue, setSelectedValue] = useState<boolean | ''>('')
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([])
  const tableRows = apiData['hydra:member'] as unknown as ITableRow[]

  function handleChangeField(id: IField | ''): void {
    setSelectedField(id)
  }

  function handleChangeValue(_: string, value: boolean | ''): void {
    setSelectedValue(value)
  }

  function handleApply(): void {
    if (onMassupdate && selectedField !== '') {
      onMassupdate(selectedRows, {
        [selectedField.title]: selectedValue,
      } as unknown as Partial<T>)
    }
  }

  return (
    <>
      <PagerTable
        Field={FieldGuesser}
        count={apiData['hydra:totalItems']}
        currentPage={currentPage ?? 0}
        diffRows={prevData as unknown as ITableRow[]}
        onPageChange={onPageChange}
        onRowUpdate={onRowUpdate}
        onSelectedRows={setSelectedRows}
        ref={tableRef}
        rowsPerPage={rowsPerPage ?? defaultPageSize}
        rowsPerPageOptions={rowsPerPageOptions ?? []}
        selectedRows={selectedRows}
        tableHeaders={tableHeaders}
        tableRows={tableRows}
        onRowsPerPageChange={onRowsPerPageChange}
        noResult={noResult}
      />
      <StickyBar positionRef={tableRef} show={selectedRows.length > 0}>
        <TableStickyBar
          field={selectedField}
          fieldOptions={fieldOptions}
          fieldValue={selectedValue}
          onApply={handleApply}
          onChangeField={handleChangeField}
          onChangeValue={handleChangeValue}
          onSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
          tableRows={tableRows}
        />
      </StickyBar>
    </>
  )
}

export default TableGuesser
