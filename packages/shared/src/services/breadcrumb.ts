import { IMenuChild } from '../types'

export function getSlugArray(data: string[] | string): string[] {
  if (typeof data === 'string') {
    return [data]
  }

  const newBreadCrumbData = [data[0]]
  for (let index = 0; index < data.length - 1; index++) {
    newBreadCrumbData.push(`${newBreadCrumbData[index]}_${data[index + 1]}`)
  }
  return newBreadCrumbData
}

export function findBreadcrumbLabel(
  findIndex: number,
  slug: string[],
  menu: IMenuChild[],
  deepIndex = 0
): string {
  if (typeof menu === 'object') {
    for (const menuChild in menu) {
      if (menu[menuChild].code === slug[deepIndex]) {
        if (findIndex === deepIndex) {
          return menu[menuChild].label
        }
        return findBreadcrumbLabel(
          findIndex,
          slug,
          menu[menuChild].children,
          deepIndex + 1
        )
      }
    }
  }
  return null
}
