import { useApiList, useResource } from '~/hooks'
import { ICategories, ITreeItem } from '~/types'

import Tree from '~/components/atoms/tree/Tree'

interface IProps {
  selectedItem: ITreeItem
  onSelect: (item: ITreeItem) => void
}

function CategoryTree({ selectedItem, onSelect }: IProps): JSX.Element {
  const resourceName = '"Category"'
  const resource = useResource(resourceName)
  const [categoriesFields] = useApiList<ICategories>(resource, false)
  const { data, error } = categoriesFields

  if (error || !data) {
    return null
  }

  return (
    categoriesFields.status === 3 && (
      <Tree
        selectedItem={selectedItem}
        onSelect={onSelect}
        data={data['hydra:member']}
      />
    )
  )
}

export default CategoryTree
