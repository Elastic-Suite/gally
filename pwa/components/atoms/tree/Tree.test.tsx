import { renderWithProviders } from '~/utils/tests'

import categories from '../../../public/mocks/categories.json'

import Tree from './Tree'

describe('Tree', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Tree data={categories.data.categoryTrees} />
    )
    expect(container).toMatchSnapshot()
  })

  it('match snapshot with selected item', () => {
    const { container } = renderWithProviders(
      <Tree
        data={categories.data.categoryTrees}
        selectedItem={{
          catalogCode: 'com_fr',
          catalogName: 'Cat One',
          "id": 1,
        }}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
