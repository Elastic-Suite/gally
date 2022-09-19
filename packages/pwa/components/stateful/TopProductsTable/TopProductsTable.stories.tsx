import { ComponentMeta, ComponentStory } from '@storybook/react'

import FieldGuesser from '../FieldGuesser/FieldGuesser'

import TopProductsTableComponent from './TopProductsTable'

export default {
  title: 'Organisms/TopProductsTable',
  component: TopProductsTableComponent,
} as ComponentMeta<typeof TopProductsTableComponent>

const Template: ComponentStory<typeof TopProductsTableComponent> = (args) => (
  <TopProductsTableComponent {...args} />
)

const mockedHeadersAndRows = {
  tableHeaders: [
    {
      name: 'code',
      label: 'Code',
      type: 'string',
      editable: false,
      sticky: false,
    },
    {
      name: 'image',
      label: 'Image',
      type: 'image',
      editable: false,
      sticky: false,
    },
    {
      name: 'name',
      label: 'Name',
      type: 'string',
      editable: false,
      sticky: false,
    },
    {
      name: 'score',
      label: 'Score',
      type: 'score',
      editable: false,
      sticky: false,
    },
    {
      name: 'stock',
      label: 'In stock',
      type: 'stock',
      editable: false,
      sticky: false,
    },
    {
      name: 'price',
      label: 'Price',
      type: 'price',
      editable: false,
      sticky: false,
    },
    {
      name: 'visible',
      label: 'Visible',
      type: 'boolean',
      editable: false,
      sticky: false,
    },
  ],
  tableRows: [
    {
      id: '1',
      code: 'VA03',
      image: 'static/media/assets/img/scarf_elastic.png',
      name: 'Product name',
      score: 100.11,
      stock: {
        status: true,
        qty: 10,
      },
      price: 10,
      visible: true,
    },
    {
      id: '2',
      code: 'VA03',
      image: 'static/media/assets/img/scarf_elastic.png',
      name: 'Product name',
      score: 100.11,
      stock: {
        status: false,
        qty: 10,
      },
      price: 10,
      visible: true,
    },
  ],
}

export const TopProductTable = Template.bind({})
TopProductTable.args = {
  Field: FieldGuesser,
  ...mockedHeadersAndRows,
}
