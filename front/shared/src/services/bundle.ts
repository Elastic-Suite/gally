import { Bundle } from '../types'

export function isVirtualCategoryEnabled(bundles: Bundle[]): boolean {
  return bundles.includes(Bundle.VIRTUAL_CATEGORY)
}
