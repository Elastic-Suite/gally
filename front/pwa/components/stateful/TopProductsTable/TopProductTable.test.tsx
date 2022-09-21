import { renderWithProviders } from '~/utils/tests'
import { DataContentType } from 'shared'

import FieldGuesser from '../FieldGuesser/FieldGuesser'

import TopProductsTable from './TopProductsTable'

describe('TopProductTable', () => {
  it('Should match snapschot', () => {
    const mockedHeadersAndRows = {
      tableHeaders: [
        {
          name: 'code',
          label: 'Code',
          type: DataContentType.STRING,
          editable: false,
          sticky: false,
        },
        {
          name: 'image',
          label: 'Image',
          type: DataContentType.IMAGE,
          editable: false,
          sticky: false,
        },
        {
          name: 'name',
          label: 'Name',
          type: DataContentType.STRING,
          editable: false,
          sticky: false,
        },
        {
          name: 'score',
          label: 'Score',
          type: DataContentType.SCORE,
          editable: false,
          sticky: false,
        },
        {
          name: 'stock',
          label: 'In stock',
          type: DataContentType.STOCK,
          editable: false,
          sticky: false,
        },
        {
          name: 'price',
          label: 'Price',
          type: DataContentType.PRICE,
          editable: false,
          sticky: false,
        },
        {
          name: 'visible',
          label: 'Visible',
          type: DataContentType.BOOLEAN,
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
          stock: true,
          price: 10,
          visible: true,
        },
        {
          id: '2',
          code: 'VA03',
          image: 'static/media/assets/img/scarf_elastic.png',
          name: 'Product name',
          score: 100.11,
          stock: false,
          price: 10,
          visible: true,
        },
      ],
    }

    const { container } = renderWithProviders(
      <TopProductsTable
        Field={FieldGuesser}
        tableHeaders={mockedHeadersAndRows.tableHeaders}
        tableRows={mockedHeadersAndRows.tableRows}
        selectedRows={[]}
        draggable
      />
    )
    expect(container).toMatchSnapshot()
  })
})
