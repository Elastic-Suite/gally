import { ComponentStory, ComponentMeta } from '@storybook/react'

import CustomTable from './CustomTable'

export default {
  title: 'Organisms/Table',
  component: CustomTable,
} as ComponentMeta<typeof CustomTable>

const Template: ComponentStory<typeof CustomTable> = (args) => (
  <CustomTable {...args} />
)

const mockedHeadersAndRows = {
  tableHeaders: [
    {
      field: 'field',
      headerName: 'Test header 1',
      type: 'boolean',
      editable: false,
    },
    {
      field: 'field2',
      headerName: 'Test header 2',
      type: 'string',
      editable: false,
    },
    {
      field: 'field3',
      headerName: 'Test header 3',
      type: 'string',
      editable: false,
    },
    {
      field: 'field4',
      headerName: 'Test header 4',
      type: 'string',
      editable: false,
    },
    {
      field: 'field5',
      headerName: 'Test header 5',
      type: 'string',
      editable: false,
    },
  ],
  tableRows: [
    {
      id: 1,
      field: true,
      field2: 'hello1',
      field3:
        'Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
      field4: 'One field',
      field5: 'one other field',
    },
    {
      id: 2,
      field: true,
      field2: 'hello2',
      field3:
        'Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
      field4: 'One field',
      field5: 'one other field',
    },
  ],
}

export const WithMassiveSelection = Template.bind({})
WithMassiveSelection.args = {
  ...mockedHeadersAndRows,
}

export const WithoutMassiveSelection = Template.bind({})
WithoutMassiveSelection.args = {
  ...mockedHeadersAndRows,
  onMassiveAction: null,
}
