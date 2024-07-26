import {
  AggregationType,
  ICategoryTypeDefaultFilterInputType,
  IEntityIntegerTypeFilterInput,
  IProductFieldFilterInput,
  ISelectTypeDefaultFilterInputType,
  IStockTypeDefaultFilterInputType,
} from '@elastic-suite/gally-admin-shared'

import { IActiveFilters } from '../types'
import { add, format, parse } from 'date-fns'

type DurationKey = 'y' | 'M' | 'd'

const durationFormat: Record<DurationKey, string> = {
  y: 'years',
  M: 'months',
  d: 'days',
}

/* eslint-disable no-underscore-dangle */
export function getProductFilters(
  activeFilters: IActiveFilters
): IProductFieldFilterInput[] {
  const data: IProductFieldFilterInput[] = []
  activeFilters.forEach((activeFilter) => {
    const precAcc = data.find(
      (value) => Object.keys(value)[0] === activeFilter.filter.field
    )
    const acc: IProductFieldFilterInput = precAcc || {}
    if (activeFilter.filter.type === AggregationType.CATEGORY) {
      acc[activeFilter.filter.field as keyof IProductFieldFilterInput] = {
        eq: activeFilter.value,
      } as ICategoryTypeDefaultFilterInputType
    } else if (activeFilter.filter.type === AggregationType.BOOLEAN) {
      acc[activeFilter.filter.field as keyof IProductFieldFilterInput] = {
        eq: true,
      } as IStockTypeDefaultFilterInputType
    } else if (activeFilter.filter.type === AggregationType.SLIDER) {
      acc[activeFilter.filter.field as keyof IProductFieldFilterInput] = {
        lte: Number(activeFilter.value),
      } as IEntityIntegerTypeFilterInput
    } else if (activeFilter.filter.type === AggregationType.CHECKBOX) {
      if (!(activeFilter.filter.field in acc)) {
        acc[activeFilter.filter.field as keyof IProductFieldFilterInput] = {
          in: [],
        }
      }
      ;(
        acc[
          activeFilter.filter.field as keyof IProductFieldFilterInput
        ] as ISelectTypeDefaultFilterInputType
      ).in.push(activeFilter.value)
    } else if (activeFilter.filter.type === AggregationType.HISTOGRAM_DATE) {
      if (!acc.boolFilter?._should) {
        acc.boolFilter = { _should: [] }
      }
      const field = activeFilter.filter.field as keyof IProductFieldFilterInput
      const date = parse(
        activeFilter.value,
        activeFilter.filter.date_format,
        new Date()
      )

      const incrementString = activeFilter.filter.date_range_interval
      const incrementNumber = Number(
        incrementString.substring(0, incrementString.length - 1)
      )
      const incrementType = incrementString.substring(
        incrementString.length - 1
      ) as DurationKey

      const gt = format(date, activeFilter.filter.date_format)
      const lt = format(
        add(date, {
          [durationFormat[incrementType]]: incrementNumber,
        }),
        activeFilter.filter.date_format
      )

      acc.boolFilter._should.push({
        [field]: {
          gt,
          lt,
        },
      })
    } else if (activeFilter.filter.type === AggregationType.HISTOGRAM) {
      if (!acc.boolFilter?._should) {
        acc.boolFilter = { _should: [] }
      }
      const field = activeFilter.filter.field as keyof IProductFieldFilterInput
      const arrayValue = activeFilter.value.split('-')
      const [firstValue, secondValue] = arrayValue

      if (arrayValue.length > 1) {
        const isFirstValueIsAsterisk = firstValue === '*'
        const isSecondValueIsAsterisk = secondValue === '*'
        let data: Record<string, number> = {}

        if (isFirstValueIsAsterisk && !isSecondValueIsAsterisk) {
          data = { lt: Number(secondValue) }
        } else if (!isFirstValueIsAsterisk && !isSecondValueIsAsterisk) {
          data = { gte: Number(firstValue), lte: Number(secondValue) }
        } else {
          data = { gt: Number(firstValue) }
        }

        acc.boolFilter._should.push({
          [field]: data,
        })
      }
    }
    if (!precAcc) data.push(acc)
  })

  return data
}