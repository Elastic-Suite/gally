import Tree from '~/components/atoms/tree/Tree'
import { ICategories, ITreeItem } from '~/types/categories'
import { useApiList, useResource } from '~/hooks'
import { IHydraResponse } from '~/types'

interface IProps {
  selectedItem: ITreeItem
  onSelect: (item: ITreeItem) => void
}

function CategoryTree({ selectedItem, onSelect }: IProps): JSX.Element {
  const resourceName = 'categories'
  const resource = useResource(resourceName)
  const [categoriesFields] = useApiList<IHydraResponse<ICategories>>(
    resource,
    false
  )

  return (
    categoriesFields.status === 3 && (
      <Tree
        selectedItem={selectedItem}
        onSelect={onSelect}
        data={categoriesFields.data['hydra:member']}
      />
    )
  )
}

export default CategoryTree
