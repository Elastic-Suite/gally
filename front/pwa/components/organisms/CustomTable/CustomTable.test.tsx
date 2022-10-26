import { DataContentType } from 'shared'
import { renderWithProviders } from '~/utils/tests'

import FieldGuesser from '~/components/stateful/FieldGuesser/FieldGuesser'

import CustomTable from './CustomTable'

const tableHeadersWithoutSticky = [
  {
    input: DataContentType.BOOLEAN,
    name: 'field',
    label: 'Test header switch',
    type: DataContentType.BOOLEAN,
    editable: false,
    sticky: false,
  },
  {
    input: DataContentType.BOOLEAN,
    name: 'field2',
    label: 'Test header switch',
    type: DataContentType.BOOLEAN,
    editable: false,
    sticky: false,
  },
]
const tableHeadersWithSticky = [
  {
    input: DataContentType.BOOLEAN,
    name: 'field',
    label: 'Test header switch',
    type: DataContentType.BOOLEAN,
    editable: false,
    sticky: false,
  },
  {
    input: DataContentType.BOOLEAN,
    name: 'field2',
    label: 'Test header switch',
    type: DataContentType.BOOLEAN,
    editable: false,
    sticky: false,
  },
]
const tableHeadersEditable = [
  {
    input: DataContentType.BOOLEAN,
    name: 'field',
    label: 'Test header switch',
    type: DataContentType.BOOLEAN,
    editable: true,
    sticky: false,
  },
  {
    input: DataContentType.SELECT,
    name: 'field2',
    label: 'Test header dropdown',
    type: DataContentType.SELECT,
    editable: true,
    sticky: false,
    options: [
      { label: 'Select an item', value: 0 },
      { label: 'Ten', value: 10 },
      { label: 'Twenty', value: 20 },
      { label: 'Thirty', value: 30 },
    ],
  },
]
const tableRows = [
  {
    id: '1',
    field: true,
  },
]

describe('CustomTable', () => {
  it('match snapshot without selection, without draggable, without sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        Field={FieldGuesser}
        tableHeaders={tableHeadersWithoutSticky}
        tableRows={tableRows}
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot without selection, without draggable, with sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        Field={FieldGuesser}
        tableHeaders={tableHeadersWithSticky}
        tableRows={tableRows}
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with selection, without draggable, without sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        Field={FieldGuesser}
        tableHeaders={tableHeadersWithoutSticky}
        tableRows={tableRows}
        selectedRows={['fake_id']}
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with selection, without draggable, with sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        Field={FieldGuesser}
        tableHeaders={tableHeadersWithSticky}
        tableRows={tableRows}
        selectedRows={['fake_id']}
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with selection, with draggable, without sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        Field={FieldGuesser}
        tableHeaders={tableHeadersWithoutSticky}
        tableRows={tableRows}
        selectedRows={['fake_id']}
        draggable
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with selection, with draggable, with sticky headers', () => {
    const { container } = renderWithProviders(
      <CustomTable
        Field={FieldGuesser}
        tableHeaders={tableHeadersWithSticky}
        tableRows={tableRows}
        selectedRows={['fake_id']}
        draggable
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('match snapshot with editable content', () => {
    const { container } = renderWithProviders(
      <CustomTable
        Field={FieldGuesser}
        tableHeaders={tableHeadersEditable}
        tableRows={tableRows}
        selectedRows={['fake_id']}
        draggable
      />
    )

    expect(container).toMatchSnapshot()
  })
})
