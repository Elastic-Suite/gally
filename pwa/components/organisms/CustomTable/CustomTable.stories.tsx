import { ComponentMeta, ComponentStory } from '@storybook/react'
import CustomTableComponent from './CustomTable'

export default {
  title: 'Organisms/CustomTable',
  component: CustomTableComponent,
} as ComponentMeta<typeof CustomTableComponent>

const Template: ComponentStory<typeof CustomTableComponent> = (args) => (
  <CustomTableComponent {...args} />
)

const mockedHeadersAndRows = {
  tableHeaders: [
    {
      field: 'field',
      headerName: 'Test header switch',
      type: 'boolean',
      editable: false,
      sticky: false,
    },
    {
      field: 'field2',
      headerName: 'Test header text',
      type: 'string',
      editable: false,
      sticky: false,
    },
    {
      field: 'field3',
      headerName: 'Test header long text',
      type: 'string',
      editable: false,
      sticky: false,
    },
    {
      field: 'field4',
      headerName: 'Test header label',
      type: 'string',
      editable: false,
      sticky: false,
    },
    {
      field: 'field5',
      headerName: 'Test header dropdown',
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
      headerName: 'Test header Tag',
      type: 'tag',
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
    },
    {
      id: '2',
      field: true,
      field2: 'hello2',
      field3:
        'Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
      field4: 'One field',
      field5: 10,
      field6: 'I am a tag',
    },
    {
      id: '3',
      field: true,
      field2: 'hello2',
      field3:
        'Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
      field4: 'One field',
      field5: 10,
      field6: 'I am a tag',
    },
    {
      id: '4',
      field: true,
      field2: 'hello2',
      field3:
        'Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
      field4: 'One field',
      field5: 10,
      field6: 'I am a tag',
    },
    {
      id: '5',
      field: true,
      field2: 'hello2',
      field3:
        'Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
      field4: 'One field',
      field5: 10,
      field6: 'I am a tag',
    },
    {
      id: '6',
      field: true,
      field2: 'hello2',
      field3:
        'Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
      field4: 'One field',
      field5: 10,
      field6: 'I am a tag',
    },
    {
      id: '7',
      field: true,
      field2: 'hello2',
      field3:
        'Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
      field4: 'One field',
      field5: 10,
      field6: 'I am a tag',
    },
    {
      id: '8',
      field: true,
      field2: 'hello2',
      field3:
        'Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
      field4: 'One field',
      field5: 10,
      field6: 'I am a tag',
    },
    {
      id: '9',
      field: true,
      field2: 'hello2',
      field3:
        'Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
      field4: 'One field',
      field5: 10,
      field6: 'I am a tag',
    },
    {
      id: '10',
      field: true,
      field2: 'hello2',
      field3:
        'Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
      field4: 'One field',
      field5: 10,
      field6: 'I am a tag',
    },
  ],
}

export const CustomTable = Template.bind({})
CustomTable.args = {
  ...mockedHeadersAndRows,
}
