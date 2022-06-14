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
    'testHeader1',
    'testHeader2',
    'testHeader3',
    'testHeader4',
    'testHeader5',
  ],
  tableRows: [
    {
      id: 'idLine1',
      cells: [
        {
          id: 'id1',
          value: 'valueName',
          type: 'string',
          isEditable: false,
        },
        {
          id: 'id2',
          value: 'valueame',
          type: 'string',
          isEditable: false,
        },
        {
          id: 'id3',
          value:
            'Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
          type: 'string',
          isEditable: false,
        },
        {
          id: 'id4',
          value: 'value1Code',
          type: 'string',
          isEditable: false,
        },
        {
          id: 'id5',
          value: true,
          type: 'boolean',
          isEditable: false,
        },
      ],
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
