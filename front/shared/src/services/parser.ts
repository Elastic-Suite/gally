import jsonld, { JsonLdDocument } from 'jsonld'

import { headerRegexp } from '../constants'
import {
  IApi,
  IEntrypoint,
  IExpandedDocsJsonld,
  IExpandedEntrypoint,
  IExpandedHydraProperty,
  IExpandedHydraSupportedClass,
  IJsonldId,
  IJsonldRange,
  IResource,
} from '../types'

import { fetchJson } from './fetch'

type IExpandedHydraSupportedClassMap = Map<string, IExpandedHydraSupportedClass>

export function getDocumentationUrlFromHeaders(headers: Headers): string {
  const linkHeader = headers.get('Link')
  if (linkHeader) {
    const matches = headerRegexp.exec(linkHeader)
    return matches[1]
  }
}

export async function fetchDocs(apiUrl: string): Promise<{
  docs: IExpandedDocsJsonld
  docsUrl: string
  entrypoint: IExpandedEntrypoint
  entrypointUrl: string
}> {
  const { json: entrypoint, response } = await fetchJson<IEntrypoint>(apiUrl)
  const docsUrl = getDocumentationUrlFromHeaders(response.headers)
  const { json: docs } = await fetchJson<JsonLdDocument>(docsUrl)
  const [expandedDoc, expandedEntrypoint] = await Promise.all([
    jsonld.expand(docs, { base: docsUrl }),
    jsonld.expand(entrypoint, { base: apiUrl }),
  ])
  return {
    docs: expandedDoc[0] as unknown as IExpandedDocsJsonld,
    docsUrl,
    entrypoint: expandedEntrypoint[0] as unknown as IExpandedEntrypoint,
    entrypointUrl: apiUrl,
  }
}

export function getSupportedClassMap(
  jsonld: IExpandedDocsJsonld
): IExpandedHydraSupportedClassMap {
  return new Map(
    jsonld['http://www.w3.org/ns/hydra/core#supportedClass'].map(
      (supportedClass) => [supportedClass['@id'], supportedClass]
    )
  )
}

export function isIJsonldRange(
  range: IJsonldId | IJsonldRange
): range is IJsonldRange {
  return 'http://www.w3.org/2002/07/owl#equivalentClass' in range
}

export function findRelatedClass(
  supportedClassMap: IExpandedHydraSupportedClassMap,
  property: IExpandedHydraProperty
): IExpandedHydraSupportedClass {
  if (property['http://www.w3.org/2000/01/rdf-schema#range'] instanceof Array) {
    for (const range of property[
      'http://www.w3.org/2000/01/rdf-schema#range'
    ]) {
      if (isIJsonldRange(range)) {
        const onProperty =
          range['http://www.w3.org/2002/07/owl#equivalentClass'][0][
            'http://www.w3.org/2002/07/owl#onProperty'
          ][0]['@id']
        const allValuesFrom =
          range['http://www.w3.org/2002/07/owl#equivalentClass'][0][
            'http://www.w3.org/2002/07/owl#allValuesFrom'
          ][0]['@id']
        if (
          allValuesFrom &&
          onProperty === 'http://www.w3.org/ns/hydra/core#member'
        ) {
          return supportedClassMap.get(allValuesFrom)
        }
      }
    }
  }
  // As a fallback, find an operation available on the property of the entrypoint returning the searched type (usually POST)
  for (const entrypointSupportedOperation of property[
    'http://www.w3.org/ns/hydra/core#supportedOperation'
  ] || []) {
    if (
      !entrypointSupportedOperation['http://www.w3.org/ns/hydra/core#returns']
    ) {
      continue
    }
    const returns =
      entrypointSupportedOperation[
        'http://www.w3.org/ns/hydra/core#returns'
      ][0]['@id']
    if (
      'string' === typeof returns &&
      returns.indexOf('http://www.w3.org/ns/hydra/core') !== 0
    ) {
      return supportedClassMap.get(returns)
    }
  }
}

export function simplifyJsonldObject(
  property: Record<string, unknown>
): unknown {
  if ('@value' in property) {
    return property['@value']
  }
  return Object.fromEntries(
    Object.entries(property).map(([key, value]) => {
      const name = key.substring(key.lastIndexOf('#') + 1)
      if (!(value instanceof Array)) {
        if (!(value instanceof Object)) {
          return [name, value]
        }
        return [name, simplifyJsonldObject(value as Record<string, unknown>)]
      }
      if (value.length === 1) {
        if (!(value[0] instanceof Object)) {
          return [name, value[0]]
        }
        return [name, simplifyJsonldObject(value[0])]
      }
      if (!(value[0] instanceof Object)) {
        return [name, value]
      }
      return [name, value.map(simplifyJsonldObject)]
    })
  )
}

export async function parseSchema(apiUrl: string): Promise<IApi> {
  const { docs, entrypoint } = await fetchDocs(apiUrl)

  const supportedClassMap = getSupportedClassMap(docs)
  const entrypointClass = supportedClassMap.get(entrypoint['@type'][0])

  let resources = []
  if (entrypointClass) {
    resources = entrypointClass[
      'http://www.w3.org/ns/hydra/core#supportedProperty'
    ].reduce((acc, supportedProperty) => {
      if (supportedProperty['http://www.w3.org/ns/hydra/core#property'][0]) {
        const [property] =
          supportedProperty['http://www.w3.org/ns/hydra/core#property']
        const relatedClass = findRelatedClass(supportedClassMap, property)
        if (relatedClass && entrypoint[property['@id']]) {
          const resource = simplifyJsonldObject({
            ...relatedClass,
            'http://www.w3.org/ns/hydra/core#supportedOperation': [
              ...property['http://www.w3.org/ns/hydra/core#supportedOperation'],
              ...relatedClass[
                'http://www.w3.org/ns/hydra/core#supportedOperation'
              ],
            ],
          } as unknown as Record<string, unknown>) as Omit<IResource, 'url'>
          const [entrypointUrl] = entrypoint[property['@id']]
          acc.push({
            ...resource,
            url:
              typeof entrypointUrl === 'string'
                ? entrypointUrl
                : entrypointUrl['@id'],
          })
        }
      }
      return acc
    }, [])
  }

  return resources
}
