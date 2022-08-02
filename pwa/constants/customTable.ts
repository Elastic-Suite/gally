import { DataContentType, ITableHeader } from '~/types'

export const reorderingColumnWidth = 48 // 48px provide by Figma
export const selectionColumnWidth = 80 // 68px provide by Figma ( TODO : dicuss with Morgane to rework this part if needed to be exactly like figma )
export const stickyColunWidth = 180 // 180px, fixed width for sticky column width ( TODO : add a table )

export const productTableFields = `id
sku
name
score
stock {
  status
}
price
`
export const productTableheader: ITableHeader[] = [
  {
    field: 'sku',
    headerName: 'Code',
    type: DataContentType.STRING,
  },
  {
    field: 'name',
    headerName: 'Name',
    type: DataContentType.STRING,
  },
  {
    field: 'score',
    headerName: 'Score',
    type: DataContentType.SCORE,
  },
  {
    field: 'stock',
    headerName: 'Stock',
    type: DataContentType.STOCK,
  },
  {
    field: 'price',
    headerName: 'Price',
    type: DataContentType.PRICE,
  },
]
