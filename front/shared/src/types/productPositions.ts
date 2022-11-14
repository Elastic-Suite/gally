export interface IGraphqlProductPosition {
  getPositionsCategoryProductMerchandising: {
    result: string
  }
}

export interface IProductPosition {
  productId: number
  position: number
}

export type IProductPositions = IProductPosition[]
