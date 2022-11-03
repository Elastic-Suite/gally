import { IJsonldBase } from './jsonld'

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface ICategorySortingOption extends IJsonldBase {
  label: string
  code: string
}

export interface IGraphqlCategorySortingOption {
  categorySortingOptions: ICategorySortingOption[]
}
