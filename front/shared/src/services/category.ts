import { ITreeItem } from '../types'

export function flatTree(tree: ITreeItem[], flat: ITreeItem[]): void {
  tree.forEach((item) => {
    flat.push(item)
    if (item.children) {
      flatTree(item.children, flat)
    }
  })
}
