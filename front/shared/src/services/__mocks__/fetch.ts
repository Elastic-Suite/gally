import docs from '../../mocks/static/docs.json'
import entrypoint from '../../mocks/static/index.json'
import graphql from '../../mocks/static/graphql.json'

const body = { hello: 'world' }

export const fetchJson = jest.fn((url: string): Promise<unknown> => {
  switch (url) {
    case 'http://localhost/':
      return Promise.resolve({
        json: entrypoint,
        response: {
          headers: new Headers({
            Link: '<http://localhost/docs.jsonld>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"',
          }),
        },
      })
    case 'http://localhost/docs.jsonld':
      return Promise.resolve({
        json: docs,
      })
    case 'http://localhost/graphql':
      return Promise.resolve({
        json: graphql,
        response: { status: 200 },
      })
    default:
      return Promise.resolve({
        json: body,
        response: { headers: new Headers() },
      })
  }
})
