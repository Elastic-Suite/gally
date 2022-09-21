import { expandedDocs, expandedEntrypoint } from 'shared'

function expand(doc: Record<string, unknown>): Promise<[unknown]> {
  if (doc['@type'] === 'Entrypoint') {
    return Promise.resolve([expandedEntrypoint])
  } else if (doc['@type'] === 'hydra:ApiDocumentation') {
    return Promise.resolve([expandedDocs])
  }
  return Promise.resolve([doc])
}

const jsonld = {
  expand,
}

export default jsonld
