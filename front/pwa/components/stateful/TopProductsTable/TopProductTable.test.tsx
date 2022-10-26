import { renderWithProviders } from '~/utils/tests'
import { DataContentType, ITableHeader, ITableRow } from 'shared'

import FieldGuesser from '../FieldGuesser/FieldGuesser'

import TopProductsTable from './TopProductsTable'

describe('TopProductTable', () => {
  it('Should match snapschot', () => {
    const tableHeaders: ITableHeader[] = [
      {
        input: DataContentType.STRING,
        name: 'code',
        label: 'Code',
        type: DataContentType.STRING,
        editable: false,
        sticky: false,
      },
      {
        input: DataContentType.IMAGE,
        name: 'image',
        label: 'Image',
        type: DataContentType.IMAGE,
        editable: false,
        sticky: false,
      },
      {
        input: DataContentType.STRING,
        name: 'name',
        label: 'Name',
        type: DataContentType.STRING,
        editable: false,
        sticky: false,
      },
      {
        input: DataContentType.SCORE,
        name: 'score',
        label: 'Score',
        type: DataContentType.SCORE,
        editable: false,
        sticky: false,
      },
      {
        input: DataContentType.STOCK,
        name: 'stock',
        label: 'In stock',
        type: DataContentType.STOCK,
        editable: false,
        sticky: false,
      },
      {
        input: DataContentType.PRICE,
        name: 'price',
        label: 'Price',
        type: DataContentType.PRICE,
        editable: false,
        sticky: false,
      },
      {
        input: DataContentType.BOOLEAN,
        name: 'visible',
        label: 'Visible',
        type: DataContentType.BOOLEAN,
        editable: false,
        sticky: false,
      },
    ]
    const tableRows: ITableRow[] = [
      {
        id: '1',
        code: 'VA03',
        image: 'static/media/assets/img/scarf_elastic.png',
        name: 'Product name',
        score: 100.11,
        stock: { status: true },
        price: [{ price: 10 }],
        visible: true,
      },
      {
        id: '2',
        code: 'VA03',
        image: 'static/media/assets/img/scarf_elastic.png',
        name: 'Product name',
        score: 100.11,
        stock: { status: false },
        price: [{ price: 10 }],
        visible: true,
      },
    ]
    const { container } = renderWithProviders(
      <TopProductsTable
        Field={FieldGuesser}
        tableHeaders={tableHeaders}
        tableRows={tableRows}
        selectedRows={[]}
        draggable
      />
    )
    expect(container).toMatchSnapshot()
  })
})
