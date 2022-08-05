import { useApiList, useResource } from '~/hooks'
import { ICategories, IHydraResponse, ITreeItem } from '~/types'

import Tree from '~/components/atoms/tree/Tree'

interface IProps {
  selectedItem: ITreeItem
  onSelect: (item: ITreeItem) => void
}

function CategoryTree({ selectedItem, onSelect }: IProps): JSX.Element {
  const resourceName = '"Category"'
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
