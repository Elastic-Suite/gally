import { useFetchApi } from '~/hooks'
import { ICategories, ITreeItem } from '~/types'

import Tree from '~/components/atoms/tree/Tree'

interface IProps {
  catalog: string | number
  localizedCatalog: string | number
  selectedItem: ITreeItem
  onSelect: (item: ITreeItem) => void
}

function CategoryTree({
  catalog,
  localizedCatalog,
  selectedItem,
  onSelect,
}: IProps): JSX.Element {
  const [categoryTreeFields] = useFetchApi<ICategories>(
    `categoryTree?/&catalogId=${catalog}&localizedCatalogId=${localizedCatalog}`
  )
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
