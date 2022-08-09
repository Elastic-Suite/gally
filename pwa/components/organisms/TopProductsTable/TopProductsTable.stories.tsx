import { ComponentMeta, ComponentStory } from '@storybook/react'
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
      field: 'code',
      headerName: 'Code',
      type: 'string',
      editable: false,
      sticky: false,
    },
    {
      field: 'image',
      headerName: 'Image',
      type: 'image',
      editable: false,
      sticky: false,
    },
    {
      field: 'name',
      headerName: 'Name',
      type: 'string',
      editable: false,
      sticky: false,
    },
    {
      field: 'score',
      headerName: 'Score',
      type: 'score',
      editable: false,
      sticky: false,
    },
    {
      field: 'stock',
      headerName: 'In stock',
      type: 'stock',
      editable: false,
      sticky: false,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'price',
      editable: false,
      sticky: false,
    },
    {
      field: 'visible',
      headerName: 'Visible',
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
      score: {
        scoreValue: 100.11,
        boostInfos: {
          type: 'down',
          boostNumber: 1,
          boostMultiplicator: 1.1,
        },
      },
      stock: true,
      price: 10,
      visible: true,
    },
    {
      id: '2',
      code: 'VA03',
      image: 'static/media/assets/img/scarf_elastic.png',
      name: 'Product name',
      score: {
        scoreValue: 100.11,
        boostInfos: {
          type: 'up',
          boostNumber: 1,
          boostMultiplicator: 1.1,
        },
      },
      stock: false,
      price: 10,
      visible: true,
    },
  ],
}

export const TopProductTable = Template.bind({})
TopProductTable.args = {
  ...mockedHeadersAndRows,
}
