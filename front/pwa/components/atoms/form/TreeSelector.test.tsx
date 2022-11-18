import { renderWithProviders } from '~/utils/tests'
import categories from '~/public/mocks/categories.json'

import TreeSelector from './TreeSelector'

describe('TreeSelector', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(
      <TreeSelector data={categories.categories} multiple value={[]} />
    )
    expect(container).toMatchSnapshot()
  })
})
