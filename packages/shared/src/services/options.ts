import { TFunction } from 'react-i18next'

import { IOptions } from '../types'

export function getOptionsFromEnum<T extends string | number>(
  enumObject: Record<string, T>,
  t: TFunction
): IOptions<T> {
  return Object.entries(enumObject).map(([key, value]) => ({
    value,
    label: t(key),
  }))
}
