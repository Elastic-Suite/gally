import { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import Tree from './Tree'
import categories from '../../../public/mocks/categories.json'
import { ITreeItem } from '~/types'

export default {
  title: 'Atoms/Tree',
  component: Tree,
} as ComponentMeta<typeof Tree>

const Template: ComponentStory<typeof Tree> = (args) => {
  const [selectedCategoryItem, setSelectedCategoryItem] = useState<
    ITreeItem | undefined
  >()

  function handleSelect(item: ITreeItem): void {
    setSelectedCategoryItem(item)
  }

  return (
    <>
      <Tree
        {...args}
        selectedItem={selectedCategoryItem}
        onSelect={handleSelect}
      />
      {selectedCategoryItem ? (
        <div style={{ marginTop: 30 }}>
          Item sélectionné :{' '}
          {selectedCategoryItem.catalogName || selectedCategoryItem.name}
        </div>
      ) : null}
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  data: categories.data.categoryTrees,
}
