import { fireEvent, screen } from '@testing-library/react'

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
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot without selection, without draggable, with sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersWithSticky}
        tableRows={mockedHeadersAndRows.tableRows}
        withSelection
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with selection, without draggable, without sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersWithoutSticky}
        tableRows={mockedHeadersAndRows.tableRows}
        withSelection
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with selection, without draggable, with sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersWithSticky}
        tableRows={mockedHeadersAndRows.tableRows}
        withSelection
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with selection, with draggable, without sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersWithoutSticky}
        tableRows={mockedHeadersAndRows.tableRows}
        withSelection
        draggable
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with selection, with draggable, with sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersWithSticky}
        tableRows={mockedHeadersAndRows.tableRows}
        withSelection
        draggable
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with editable content', () => {
    const { container } = renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersEditable}
        tableRows={mockedHeadersAndRows.tableRows}
        withSelection
        draggable
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('should open selection dropdown when chevron-down button is click', () => {
    renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersEditable}
        tableRows={mockedHeadersAndRows.tableRows}
        withSelection
      />
    )
    expect(screen.queryByTestId('massive-selection-dropdown-open')).toBeNull()
    fireEvent.click(screen.queryByTestId('massive-selection-dropdown'))
    expect(
      screen.queryByTestId('massive-selection-dropdown-open')
    ).toBeVisible()
  })

  it('should make sticky-bar visible when header massive selection checkbox is checked', () => {
    renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersEditable}
        tableRows={mockedHeadersAndRows.tableRows}
        withSelection
      />
    )
    expect(screen.queryByTestId('sticky-bar')).toBeNull()
    fireEvent.click(screen.queryByTestId('massive-selection').childNodes[0])
    expect(screen.queryByTestId('sticky-bar')).toBeVisible()
  })

  it('should make sticky-bar visible when a single row selection checkbox is checked on non draggable table', () => {
    renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersEditable}
        tableRows={mockedHeadersAndRows.tableRows}
        withSelection
      />
    )
    expect(screen.queryByTestId('sticky-bar')).toBeNull()
    fireEvent.click(
      screen.queryByTestId('non-draggable-single-row-selection').childNodes[0]
    )
    expect(screen.queryByTestId('sticky-bar')).toBeVisible()
  })

  it('should make sticky-bar visible when a single row selection checkbox is checked on draggable table', () => {
    renderWithProviders(
      <CustomTable
        tableHeaders={mockedHeadersAndRows.tableHeadersEditable}
        tableRows={mockedHeadersAndRows.tableRows}
        withSelection
        draggable
      />
    )
    expect(screen.queryByTestId('sticky-bar')).toBeNull()
    fireEvent.click(
      screen.queryByTestId('draggable-single-row-selection').childNodes[0]
    )
    expect(screen.queryByTestId('sticky-bar')).toBeVisible()
  })
})
