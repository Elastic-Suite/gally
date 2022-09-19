import { renderWithProviders } from '~/utils/tests'

import Pagination from './Pagination'

describe('Pagination', () => {
  it('should match snapshot for bottom pagination', () => {
    const { container } = renderWithProviders(
      <Pagination
        isBottom
        count={10}
        currentPage={1}
        rowsPerPage={5}
        rowsPerPageOptions={[]}
        onRowsPerPageChange={null}
        onPageChange={jest.fn()}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should match snapshot for top pagination', () => {
    const { container } = renderWithProviders(
      <Pagination
        isBottom={false}
        count={10}
        currentPage={1}
        rowsPerPage={5}
        rowsPerPageOptions={[]}
        onRowsPerPageChange={null}
        onPageChange={jest.fn()}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
