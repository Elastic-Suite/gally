import { ICategories, IFetch, ITreeItem } from '~/types'

import Tree from '~/components/atoms/tree/Tree'

interface IProps {
  categoryTreeFields: IFetch<ICategories>
  selectedItem: ITreeItem
  onSelect: (item: ITreeItem) => void
}

function CategoryTree({
  categoryTreeFields,
  selectedItem,
  onSelect,
}: IProps): JSX.Element {
  const { data, error } = categoryTreeFields

  if (error || !data) {
    return null
  }

  return (
    categoryTreeFields.status === 3 && (
      <Tree
        selectedItem={selectedItem}
        onSelect={onSelect}
        data={data.categories}
      />
    )
  )
}

export default CategoryTree
