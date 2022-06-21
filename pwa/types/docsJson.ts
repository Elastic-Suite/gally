import { HttpCode, Method } from './fetch'
import { HydraPropertyType } from './hydra'

export interface DocsJsonContent {
  schema: HydraPropertyType
}

export interface DocsJsonBody {
  description: string
  content: Record<string, DocsJsonContent>
  required: boolean
}

export interface DocsJsonParameter {
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

export interface DocsJsonLink {
  operationId: string
  parameters: Record<string, string>
  description: string
}

export interface DocsJsonResponse {
  content?: Record<string, DocsJsonContent>
  description: string
  links?: Record<string, DocsJsonLink>
}

export type DocsJsonResponses = {
  [code in HttpCode]?: DocsJsonResponse
}

export interface DocsJsonOperation {
  operationId?: string
  tags?: string[]
  responses?: DocsJsonResponses
  summary?: string
  description?: string
  parameters: DocsJsonParameter[]
  requestBody?: DocsJsonBody
  deprecated?: boolean
}

export type DocsJsonMethods = {
  [method in Lowercase<Method>]?: DocsJsonOperation
}

export interface DocsJsonPath extends DocsJsonMethods {
  parameters: string[]
  ref?: string
}

export interface DocsJsonSecurity {
  apiKey: string[]
}

export interface DocsJsonServer {
  url: string
  description: string
}

export interface DocsJsonInfo {
  title: string
  description: string
  version: string
}

export interface DocsJsonSecuritySchemes {
  type: string
  description: string
  name: string
  in: string
}

export interface DocsJsonComponents {
  schemas: Record<string, HydraPropertyType>
  responses: DocsJsonResponses
  parameters: Record<string, unknown> // FIXME
  examples: Record<string, unknown> // FIXME
  requestBodies: Record<string, unknown> // FIXME
  headers: Record<string, unknown> // FIXME
  securitySchemes: Record<string, DocsJsonSecuritySchemes>
}

export interface DocsJson {
  openapi: string
  info: DocsJsonInfo
  servers: DocsJsonServer[]
  paths: Record<string, DocsJsonPath>
  components: Record<string, unknown>
  security: DocsJsonSecurity[]
  tags: string[]
}
