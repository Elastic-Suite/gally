import { renderWithProviders } from '~/utils/tests'

import categories from '../../../public/mocks/categories.json'

import Tree from './Tree'

describe('Tree', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Tree data={categories.categories} />
    )
    expect(container).toMatchSnapshot()
  })

  it('match snapshot with selected item', () => {
    const { container } = renderWithProviders(
      <Tree data={categories.categories} value={categories.categories[0]} />
    )
    expect(container).toMatchSnapshot()
  })
})
