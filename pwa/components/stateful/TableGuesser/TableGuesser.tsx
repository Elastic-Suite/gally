import { Dispatch, SetStateAction, useRef, useState } from 'react'

import { defaultPageSize } from '~/constants'
import {
  useApiEditableFieldOptions,
  useApiHeaders,
  useResourceOperations,
} from '~/hooks'
import {
  IField,
  IHydraMember,
  IHydraResponse,
  IResource,
  ISourceField,
  ITableRow,
} from '~/types'

import PagerTable from '~/components/organisms/PagerTable/PagerTable'
import StickyBar from '~/components/molecules/CustomTable/StickyBar/StickyBar'

import FieldGuesser from '../FieldGuesser/FieldGuesser'
import TableStickyBar from '../TableStickyBar/TableStickyBar'
import { isFetchError } from '~/services'

interface IProps<T extends IHydraMember> {
  apiData: IHydraResponse<T>
  currentPage?: number
  onPageChange: (page: number) => void
  onRowUpdate?: (
    id: string | number,
    field: string,
    value: boolean | number | string
  ) => void
  resource: IResource
  rowsPerPage?: number
  rowsPerPageOptions?: number[]
  updateSourceFields: Dispatch<SetStateAction<ISourceField[]>>
}

function TableGuesser<T extends IHydraMember>(props: IProps<T>): JSX.Element {
  const {
    apiData,
    currentPage,
    onPageChange,
    onRowUpdate,
    resource,
    rowsPerPage,
    rowsPerPageOptions,
    updateSourceFields,
  } = props
  const tableHeaders = useApiHeaders(resource)
  const fieldOptions = useApiEditableFieldOptions(resource)
  const { update } = useResourceOperations<ISourceField>(resource)

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

  async function handleApply(): Promise<void> {
    if (update && selectedField !== '') {
      // FIXME: change when the mass updae endpoint is available
      const promises = selectedRows.map((id) =>
        update(id, { [selectedField.title]: selectedValue })
      )
      const sourceFields = await Promise.all(promises)
      const sourceFieldsMap = new Map(
        sourceFields
          .filter((sourceField) => !isFetchError(sourceField))
          .map((sourceField: ISourceField) => [sourceField.id, sourceField])
      )
      updateSourceFields((items) =>
        items.map((item) =>
          selectedRows.includes(item.id) && sourceFieldsMap.has(item.id)
            ? sourceFieldsMap.get(item.id)
            : item
        )
      )
    }
  }

  return (
    <>
      <PagerTable
        Field={FieldGuesser}
        count={apiData['hydra:totalItems']}
        currentPage={currentPage ?? 0}
        onPageChange={onPageChange}
        onRowUpdate={onRowUpdate}
        onSelectedRows={setSelectedRows}
        ref={tableRef}
        rowsPerPage={rowsPerPage ?? defaultPageSize}
        rowsPerPageOptions={rowsPerPageOptions ?? []}
        selectedRows={selectedRows}
        tableHeaders={tableHeaders}
        tableRows={tableRows}
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
