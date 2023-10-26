import {
  AggregationType,
  IDocumentEqualFilterInput,
  IDocumentFieldFilterInput,
  IDocumentRangeFilterInput,
} from '@elastic-suite/gally-admin-shared'

import { IActiveFilters } from '../types'

export function getDocumentFilters(
  activeFilters: IActiveFilters
): IDocumentFieldFilterInput[] {
  return activeFilters.reduce<IDocumentFieldFilterInput[]>(
    (acc, activeFilter, currentIndex) => {
      if (activeFilter.filter.type === AggregationType.CATEGORY) {
        acc[currentIndex] = {
          ['equalFilter' as keyof IDocumentFieldFilterInput]: {
            field: activeFilter.filter.field,
            eq: activeFilter.value,
          } as IDocumentEqualFilterInput,
        }
      } else if (activeFilter.filter.type === AggregationType.BOOLEAN) {
        acc[currentIndex] = {
          ['equalFilter' as keyof IDocumentFieldFilterInput]: {
            field: activeFilter.filter.field,
            eq: 'true',
          } as IDocumentEqualFilterInput,
        }
      } else if (activeFilter.filter.type === AggregationType.SLIDER) {
        acc[currentIndex] = {
          ['rangeFilter' as keyof IDocumentFieldFilterInput]: {
            field: activeFilter.filter.field,
            lte: activeFilter.value,
          } as IDocumentRangeFilterInput,
        }
      } else if (activeFilter.filter.type === AggregationType.CHECKBOX) {
        const filter = acc.find(
          (filter) =>
            'equalFilter' in filter &&
            filter.equalFilter.field === activeFilter.filter.field
        )
        if (filter) {
          filter.equalFilter.in.push(activeFilter.value)
        } else {
          acc[currentIndex] = {
            ['equalFilter' as keyof IDocumentFieldFilterInput]: {
              field: activeFilter.filter.field,
              in: [activeFilter.value],
            } as IDocumentEqualFilterInput,
          }
        }
      }
      return acc
    },
    []
  )
}
