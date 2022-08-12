import { useEffect, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ITableRow } from '~/types'

import CustomTableComponent from './CustomTable'

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

  return (
    <CustomTableComponent
      {...props}
      onReorder={setCurrentRows}
      tableRows={currentRows}
    />
  )
}

const selectedRows: string[] = []

const mockedHeadersAndRows = {
  tableHeaders: [
    {
      field: 'field',
      label: 'Test header switch',
      type: 'boolean',
      editable: false,
      sticky: false,
    },
    {
      field: 'field2',
      label: 'Test header text',
      type: 'string',
      editable: false,
      sticky: false,
    },
    {
      field: 'field3',
      label: 'Test header long text',
      type: 'string',
      editable: false,
      sticky: false,
    },
    {
      field: 'field4',
      label: 'Test header label',
      type: 'string',
      editable: false,
      sticky: false,
    },
    {
      field: 'field5',
      label: 'Test header dropdown',
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
      field: 'field6',
      label: 'Test header Tag',
      type: 'tag',
      editable: false,
      sticky: false,
    },
    {
      field: 'field7',
      label: 'Test header image',
      type: 'image',
      editable: false,
      sticky: false,
    },
  ],
  tableRows: [
    {
      id: '1',
      field: true,
      field2: 'hello1',
      field3: 'Here you will find a fake product description.',
      field4: 'One field',
      field5: 10,
      field6: 'I am a tag',
      field7: 'static/media/assets/img/scarf_elastic.png',
    },
    {
      id: '2',
      field: true,
      field2: 'hello2',
      field3: 'Here description',
      field4: 'One field',
      field5: 10,
      field6: 'I am a tag',
      field7: 'static/media/assets/img/scarf_elastic.png',
    },
  ],
  selectedRows,
}

export const CustomTable = Template.bind({})
CustomTable.args = {
  ...mockedHeadersAndRows,
}
