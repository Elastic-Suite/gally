import { ICategory } from 'shared'

export function findCategory(
  category: ICategory,
  categories: ICategory[]
): ICategory {
  let foundCategory
  function recursiveFind(element: ICategory): boolean {
    if (element.id === category.id) {
      foundCategory = element
      return true
    }
    if (element.children && element.children.length > 0) {
      return element.children.some(recursiveFind)
    }
    return false
  }
  categories.some(recursiveFind)
  return foundCategory
}
