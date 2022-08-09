import { DataContentType } from '~/types'
import { renderWithProviders } from '~/utils/tests'

import CustomTable from './CustomTable'

const mockedHeadersAndRows = {
  tableHeadersWithoutSticky: [
    {
      field: 'field',
      headerName: 'Test header switch',
      type: DataContentType.BOOLEAN,
      editable: false,
      sticky: false,
    },
    {
      field: 'field2',
      headerName: 'Test header switch',
      type: DataContentType.BOOLEAN,
      editable: false,
      sticky: false,
    },
  ],
  tableHeadersWithSticky: [
    {
      field: 'field',
      headerName: 'Test header switch',
      type: DataContentType.BOOLEAN,
      editable: false,
      sticky: false,
    },
    {
      field: 'field2',
      headerName: 'Test header switch',
      type: DataContentType.BOOLEAN,
      editable: false,
      sticky: false,
    },
  ],
  tableHeadersEditable: [
    {
      field: 'field',
      headerName: 'Test header switch',
      type: DataContentType.BOOLEAN,
      editable: true,
      sticky: false,
    },
    {
      field: 'field2',
      headerName: 'Test header dropdown',
      type: DataContentType.DROPDOWN,
      editable: true,
      sticky: false,
      options: [
        { label: 'Select an item', value: 0 },
        { label: 'Ten', value: 10 },
        { label: 'Twenty', value: 20 },
        { label: 'Thirty', value: 30 },
      ],
    },
  ],
  tableRows: [
    {
      id: '1',
      field: true,
    },
  ],
}

describe('CustomTable', () => {
  it('match snapshot without selection, without draggable, without sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersWithoutSticky}
        tableRows={mockedHeadersAndRows.tableRows}
        paginated
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot without selection, without draggable, with sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersWithSticky}
        tableRows={mockedHeadersAndRows.tableRows}
        paginated
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with selection, without draggable, without sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersWithoutSticky}
        tableRows={mockedHeadersAndRows.tableRows}
        selectedRows={['fake_id']}
        paginated
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with selection, without draggable, with sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersWithSticky}
        tableRows={mockedHeadersAndRows.tableRows}
        selectedRows={['fake_id']}
        paginated
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with selection, with draggable, without sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersWithoutSticky}
        tableRows={mockedHeadersAndRows.tableRows}
        selectedRows={['fake_id']}
        draggable
        paginated
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with selection, with draggable, with sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersWithSticky}
        tableRows={mockedHeadersAndRows.tableRows}
        selectedRows={['fake_id']}
        draggable
        paginated
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with editable content', () => {
    const { container } = renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersEditable}
        tableRows={mockedHeadersAndRows.tableRows}
        selectedRows={['fake_id']}
        draggable
        paginated
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with editable content, not paginated', () => {
    const { container } = renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersEditable}
        tableRows={mockedHeadersAndRows.tableRows}
        selectedRows={['fake_id']}
        draggable
        paginated={false}
      />
    )

    expect(container).toMatchSnapshot()
  })
})
