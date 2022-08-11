import { renderWithProviders } from '~/utils/tests'
import { DataContentType } from '~/types'
import TopProductsTable from './TopProductsTable'

describe('TopProductTable', () => {
  it('Should match snapschot', () => {
    const mockedHeadersAndRows = {
      tableHeaders: [
        {
          field: 'code',
          headerName: 'Code',
          type: DataContentType.STRING,
          editable: false,
          sticky: false,
        },
        {
          field: 'image',
          headerName: 'Image',
          type: DataContentType.IMAGE,
          editable: false,
          sticky: false,
        },
        {
          field: 'name',
          headerName: 'Name',
          type: DataContentType.STRING,
          editable: false,
          sticky: false,
        },
        {
          field: 'score',
          headerName: 'Score',
          type: DataContentType.SCORE,
          editable: false,
          sticky: false,
        },
        {
          field: 'stock',
          headerName: 'In stock',
          type: DataContentType.STOCK,
          editable: false,
          sticky: false,
        },
        {
          field: 'price',
          headerName: 'Price',
          type: DataContentType.PRICE,
          editable: false,
          sticky: false,
        },
        {
          field: 'visible',
          headerName: 'Visible',
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
        tableHeaders={mockedHeadersAndRows.tableHeaders}
        tableRows={mockedHeadersAndRows.tableRows}
        selectedRows={[]}
        draggable
      />
    )
    expect(container).toMatchSnapshot()
  })
})
