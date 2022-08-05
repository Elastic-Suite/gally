export interface IGraphqlType {
  name?: string
  description?: string
  kind?: string
  fields?: IGraphqlField[]
  interfaces?: { name: string }[]
  possibleTypes?: { name: string }[]
  enumValues?: { name: string }[]
  inputFields?: { name: string }[]
  ofType?: { name: string }
}

export interface IGraphqlField {
  name?: string
  description?: string
  type: IGraphqlType
}

export interface IGraphqlQueryType {
  fields: IGraphqlField[]
}

export interface IGraphqlSchema {
  queryType: IGraphqlQueryType
}

export interface IGraphqlDoc {
  __schema: IGraphqlSchema
}
