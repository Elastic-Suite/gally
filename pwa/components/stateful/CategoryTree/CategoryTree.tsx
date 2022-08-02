import Tree from '~/components/atoms/tree/Tree'
import { ICategoriesFields, ITreeItem } from '~/types/categories'
import { useApiList, useResource } from '~/hooks'
import catcat from '../../../public/mocks/categories.json' // DATA MOCK

interface IProps {
  selectedItem: ITreeItem
  onSelect: (item: ITreeItem) => void
}

function CategoryTree({ selectedItem, onSelect }: IProps): JSX.Element {
  const resourceName = 'categories'
  const resource = useResource(resourceName)
  const [categoriesFields] = useApiList<ICategoriesFields>(resource, false)

  return (
    categoriesFields.status === 3 && (
      <Tree
        selectedItem={selectedItem}
        onSelect={onSelect}
        // data={categoriesFields.data['hydra:member']} // DATA from API
        data={catcat.data.categoryTrees} // DATA from MOCKS
      />
    )
  )
}

export default CategoryTree
