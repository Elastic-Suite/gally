import { HttpCode, Method } from './fetch'
import { HydraPropertyType } from './hydra'

export interface IDocsJsonContent {
  schema: HydraPropertyType
}

export interface IDocsJsonBody {
  description: string
  content: Record<string, IDocsJsonContent>
  required: boolean
}

export interface IDocsJsonParameter {
  name: string
  in: string
  description: string
  required: boolean
  deprecated: boolean
  allowEmptyValue: boolean
  schema: HydraPropertyType
  style: string
  explode: boolean
  allowReserved: boolean
}

export interface IDocsJsonLink {
  operationId: string
  parameters: Record<string, string>
  description: string
}

export interface IDocsJsonResponse {
  content?: Record<string, IDocsJsonContent>
  description: string
  links?: Record<string, IDocsJsonLink>
}

export type DocsJsonResponses = {
  [code in HttpCode]?: IDocsJsonResponse
}

export interface IDocsJsonOperation {
  operationId?: string
  tags?: string[]
  responses?: DocsJsonResponses
  summary?: string
  description?: string
  parameters: IDocsJsonParameter[]
  requestBody?: IDocsJsonBody
  deprecated?: boolean
}

export type DocsJsonMethods = {
  [method in Lowercase<Method>]?: IDocsJsonOperation
}

export interface IDocsJsonPath extends DocsJsonMethods {
  parameters: string[]
  ref?: string
}

export interface IDocsJsonSecurity {
  apiKey: string[]
}

export interface IDocsJsonServer {
  url: string
  description: string
}

export interface IDocsJsonInfo {
  title: string
  description: string
  version: string
}

export interface IDocsJsonSecuritySchemes {
  type: string
  description: string
  name: string
  in: string
}

export interface IDocsJsonComponents {
  schemas: Record<string, HydraPropertyType>
  responses: DocsJsonResponses
  parameters: Record<string, unknown> // FIXME
  examples: Record<string, unknown> // FIXME
  requestBodies: Record<string, unknown> // FIXME
  headers: Record<string, unknown> // FIXME
  securitySchemes: Record<string, IDocsJsonSecuritySchemes>
}

export interface IDocsJson {
  openapi: string
  info: IDocsJsonInfo
  servers: IDocsJsonServer[]
  paths: Record<string, IDocsJsonPath>
  components: Record<string, IDocsJsonComponents>
  security: IDocsJsonSecurity[]
  tags: string[]
}
