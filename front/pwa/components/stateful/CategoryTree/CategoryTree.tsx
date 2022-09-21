import { useState } from 'react'
import { ICategories, ICategory } from 'shared'

import Tree from '~/components/atoms/tree/Tree'

interface IProps {
  categories: ICategories
  selectedItem: ICategory
  onSelect: (item: ICategory) => void
}

function CategoryTree(props: IProps): JSX.Element {
  const { categories, selectedItem, onSelect } = props
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  if (!categories) {
    return null
  }

  return (
    <Tree
      onChange={onSelect}
      onToggle={setOpenItems}
      openItems={openItems}
      data={categories.categories}
      value={selectedItem}
    />
  )
}

export default CategoryTree
