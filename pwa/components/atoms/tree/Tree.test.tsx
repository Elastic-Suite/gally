import Tree from './Tree'
import { renderWithProviders } from '~/services'
import categories from '../../../public/mocks/categories.json'

describe('Tree', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Tree data={categories.data.categoryTrees} />
    )
    expect(container).toMatchSnapshot()
  })
})
