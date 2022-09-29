import { useEffect, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ITableHeader, ITableRow } from 'shared'

import FieldGuesser from '~/components/stateful/FieldGuesser/FieldGuesser'

import CustomTableComponent from './CustomTable'
import { useRef } from '@storybook/addons'

export default {
  title: 'Organisms/CustomTable',
  component: CustomTableComponent,
} as ComponentMeta<typeof CustomTableComponent>

const Template: ComponentStory<typeof CustomTableComponent> = (args) => {
  const { tableRows, ...props } = args
  const [currentRows, setCurrentRows] = useState<ITableRow[]>(tableRows)

  useEffect(() => {
    setCurrentRows(tableRows)
  }, [tableRows])

  function handleUpdate(
    id: string | number,
    name: string,
    value: boolean | number | string
  ): void {
    setCurrentRows((prevState) =>
      prevState.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    )
  }

  return (
    <CustomTableComponent
      {...props}
      onReorder={setCurrentRows}
      onRowUpdate={handleUpdate}
      tableRows={currentRows}
    />
  )
}

const selectedRows: string[] = []
const tableHeaders = [
  {
    name: 'field',
    label: 'Non editable boolean',
    type: 'boolean',
    editable: false,
    sticky: false,
  },
  {
    name: 'field2',
    label: 'Editable boolean',
    type: 'boolean',
    editable: true,
    sticky: false,
  },
  {
    name: 'field3',
    label: 'Non editable text',
    type: 'string',
    editable: false,
    sticky: false,
  },
  {
    name: 'field4',
    label: 'Editable text',
    type: 'string',
    editable: true,
    sticky: false,
  },
  {
    name: 'field5',
    label: 'Editable dropdown',
    type: 'dropdown',
    editable: true,
    sticky: false,
    options: [
      { label: 'Select an item', value: 0 },
      { label: 'Ten', value: 10 },
      { label: 'Twenty', value: 20 },
      { label: 'Thirty', value: 30 },
    ],
  },
  {
    name: 'field6',
    label: 'Tag',
    type: 'tag',
    editable: false,
    sticky: false,
  },
  {
    name: 'field7',
    label: 'Image',
    type: 'image',
    editable: false,
    sticky: false,
  },
] as ITableHeader[]

const tableRows = [
  {
    id: '1',
    name: true,
    field: false,
    field2: false,
    field3: 'Description',
    field4: 'Edit me',
    field5: 10,
    field6: 'I am a tag',
    field7: 'static/media/assets/img/scarf_elastic.png',
  },
  {
    id: '2',
    name: true,
    field: true,
    field2: true,
    field3: 'Description',
    field4: 'Edit me',
    field5: 10,
    field6: 'I am a tag',
    field7: 'static/media/assets/img/scarf_elastic.png',
  },
] as ITableRow[]

export const Default = Template.bind({})
Default.args = {
  Field: FieldGuesser,
  tableHeaders,
  tableRows,
  selectedRows,
}

export const WithDefaultValues: ComponentStory<typeof CustomTableComponent> = (
  args
) => {
  const { tableRows } = args
  const diffRows = useRef(tableRows)

  useEffect(() => {
    diffRows.current = tableRows
  }, [tableRows])

  return <Template {...args} diffRows={diffRows.current} />
}
WithDefaultValues.args = {
  Field: FieldGuesser,
  tableHeaders,
  tableRows,
  selectedRows,
}
