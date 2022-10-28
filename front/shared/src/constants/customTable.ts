import { DataContentType, ITableHeader } from '../types'

export const reorderingColumnWidth = 48 // 48px provide by Figma
export const selectionColumnWidth = 80 // 68px provide by Figma ( TODO : dicuss with Morgane to rework this part if needed to be exactly like figma )
export const stickyColunWidth = 180 // 180px, fixed width for sticky column width ( TODO : add a table )

export const productTableheader: ITableHeader[] = [
  {
    id: 'sku',
    input: DataContentType.STRING,
    name: 'sku',
    label: 'Code',
    type: DataContentType.STRING,
  },
  {
    id: 'name',
    input: DataContentType.STRING,
    name: 'name',
    label: 'Name',
    type: DataContentType.STRING,
  },
  {
    id: 'score',
    input: DataContentType.NUMBER,
    name: 'score',
    label: 'Score',
    type: DataContentType.NUMBER,
  },
  {
    id: 'stock',
    input: DataContentType.STOCK,
    name: 'stock',
    label: 'Stock',
    type: DataContentType.STOCK,
  },
  {
    id: 'price',
    input: DataContentType.PRICE,
    name: 'price',
    label: 'Price',
    type: DataContentType.PRICE,
  },
]

export const defaultRowsPerPageOptions = [10, 25, 50]
