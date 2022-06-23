import { IDocsJson } from '~/types'

export const docsJson = {
  openapi: '3.0.3',
  info: {
    title: 'Elasticsuite API',
    description: '',
    version: '1.0.0',
  },
  servers: [{ url: '/', description: '' }],
  paths: {
    '/authentication_token': {
      ref: 'JWT Token',
      post: {
        operationId: 'postCredentialsItem',
        tags: ['Token'],
        responses: {
          '200': {
            description: 'Get JWT token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Token' },
              },
            },
          },
        },
        summary: 'Get JWT token to login.',
        description: '',
        parameters: [],
        requestBody: {
          description: 'Generate new JWT Token',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Credentials' },
            },
          },
          required: false,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/authentications/{id}': { parameters: [] },
    '/catalogs': {
      get: {
        operationId: 'getCatalogCollection',
        tags: ['Catalog'],
        responses: {
          '200': {
            description: 'Catalog collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Catalog.jsonld' },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Catalog' },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Catalog' },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of Catalog resources.',
        description: 'Retrieves the collection of Catalog resources.',
        parameters: [
          {
            name: 'currentPage',
            in: 'query',
            description: 'The collection page number',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 1 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'The number of items per page',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 30, minimum: 0 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      post: {
        operationId: 'postCatalogCollection',
        tags: ['Catalog'],
        responses: {
          '201': {
            description: 'Catalog resource created',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Catalog.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Catalog' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Catalog' },
              },
            },
            links: {
              GetCatalogItem: {
                operationId: 'getCatalogItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /catalogs/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
        },
        summary: 'Creates a Catalog resource.',
        description: 'Creates a Catalog resource.',
        parameters: [],
        requestBody: {
          description: 'The new Catalog resource',
          content: {
            'application/ld+json': {
              schema: { $ref: '#/components/schemas/Catalog.jsonld' },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/Catalog' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/Catalog' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/catalogs/{id}': {
      get: {
        operationId: 'getCatalogItem',
        tags: ['Catalog'],
        responses: {
          '200': {
            description: 'Catalog resource',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Catalog.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Catalog' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Catalog' },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a Catalog resource.',
        description: 'Retrieves a Catalog resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      put: {
        operationId: 'putCatalogItem',
        tags: ['Catalog'],
        responses: {
          '200': {
            description: 'Catalog resource updated',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Catalog.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Catalog' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Catalog' },
              },
            },
            links: {
              GetCatalogItem: {
                operationId: 'getCatalogItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /catalogs/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Replaces the Catalog resource.',
        description: 'Replaces the Catalog resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated Catalog resource',
          content: {
            'application/ld+json': {
              schema: { $ref: '#/components/schemas/Catalog.jsonld' },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/Catalog' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/Catalog' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      delete: {
        operationId: 'deleteCatalogItem',
        tags: ['Catalog'],
        responses: {
          '204': { description: 'Catalog resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the Catalog resource.',
        description: 'Removes the Catalog resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      patch: {
        operationId: 'patchCatalogItem',
        tags: ['Catalog'],
        responses: {
          '200': {
            description: 'Catalog resource updated',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Catalog.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Catalog' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Catalog' },
              },
            },
            links: {
              GetCatalogItem: {
                operationId: 'getCatalogItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /catalogs/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Updates the Catalog resource.',
        description: 'Updates the Catalog resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated Catalog resource',
          content: {
            'application/merge-patch+json': {
              schema: { $ref: '#/components/schemas/Catalog' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/categories': {
      get: {
        operationId: 'getCategoryCollection',
        tags: ['Category'],
        responses: {
          '200': {
            description: 'Category collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Category.jsonld',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Category' },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Category' },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of Category resources.',
        description: 'Retrieves the collection of Category resources.',
        parameters: [
          {
            name: 'currentPage',
            in: 'query',
            description: 'The collection page number',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 1 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'The number of items per page',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 30, minimum: 0 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      post: {
        operationId: 'postCategoryCollection',
        tags: ['Category'],
        responses: {
          '201': {
            description: 'Category resource created',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Category.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Category' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Category' },
              },
            },
            links: {
              GetCategoryItem: {
                operationId: 'getCategoryItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /categories/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
        },
        summary: 'Creates a Category resource.',
        description: 'Creates a Category resource.',
        parameters: [],
        requestBody: {
          description: 'The new Category resource',
          content: {
            'application/ld+json': {
              schema: { $ref: '#/components/schemas/Category.jsonld' },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/Category' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/Category' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/categories/{id}': {
      get: {
        operationId: 'getCategoryItem',
        tags: ['Category'],
        responses: {
          '200': {
            description: 'Category resource',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Category.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Category' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Category' },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a Category resource.',
        description: 'Retrieves a Category resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      put: {
        operationId: 'putCategoryItem',
        tags: ['Category'],
        responses: {
          '200': {
            description: 'Category resource updated',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Category.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Category' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Category' },
              },
            },
            links: {
              GetCategoryItem: {
                operationId: 'getCategoryItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /categories/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Replaces the Category resource.',
        description: 'Replaces the Category resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated Category resource',
          content: {
            'application/ld+json': {
              schema: { $ref: '#/components/schemas/Category.jsonld' },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/Category' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/Category' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      delete: {
        operationId: 'deleteCategoryItem',
        tags: ['Category'],
        responses: {
          '204': { description: 'Category resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the Category resource.',
        description: 'Removes the Category resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      patch: {
        operationId: 'patchCategoryItem',
        tags: ['Category'],
        responses: {
          '200': {
            description: 'Category resource updated',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Category.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Category' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Category' },
              },
            },
            links: {
              GetCategoryItem: {
                operationId: 'getCategoryItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /categories/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Updates the Category resource.',
        description: 'Updates the Category resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated Category resource',
          content: {
            'application/merge-patch+json': {
              schema: { $ref: '#/components/schemas/Category' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/declarative_greetings': {
      get: {
        operationId: 'getDeclarativeGreetingCollection',
        tags: ['DeclarativeGreeting'],
        responses: {
          '200': {
            description: 'DeclarativeGreeting collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/DeclarativeGreeting.jsonld',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/DeclarativeGreeting',
                  },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/DeclarativeGreeting',
                  },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of DeclarativeGreeting resources.',
        description:
          'Retrieves the collection of DeclarativeGreeting resources.',
        parameters: [
          {
            name: 'currentPage',
            in: 'query',
            description: 'The collection page number',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 1 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'The number of items per page',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 30, minimum: 0 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      post: {
        operationId: 'postDeclarativeGreetingCollection',
        tags: ['DeclarativeGreeting'],
        responses: {
          '201': {
            description: 'DeclarativeGreeting resource created',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/DeclarativeGreeting.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/DeclarativeGreeting' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/DeclarativeGreeting' },
              },
            },
            links: {
              GetDeclarativeGreetingItem: {
                operationId: 'getDeclarativeGreetingItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /declarative_greetings/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
        },
        summary: 'Creates a DeclarativeGreeting resource.',
        description: 'Creates a DeclarativeGreeting resource.',
        parameters: [],
        requestBody: {
          description: 'The new DeclarativeGreeting resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/DeclarativeGreeting.jsonld',
              },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/DeclarativeGreeting' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/DeclarativeGreeting' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/declarative_greetings/{id}': {
      get: {
        operationId: 'getDeclarativeGreetingItem',
        tags: ['DeclarativeGreeting'],
        responses: {
          '200': {
            description: 'DeclarativeGreeting resource',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/DeclarativeGreeting.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/DeclarativeGreeting' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/DeclarativeGreeting' },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a DeclarativeGreeting resource.',
        description: 'Retrieves a DeclarativeGreeting resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      put: {
        operationId: 'putDeclarativeGreetingItem',
        tags: ['DeclarativeGreeting'],
        responses: {
          '200': {
            description: 'DeclarativeGreeting resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/DeclarativeGreeting.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/DeclarativeGreeting' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/DeclarativeGreeting' },
              },
            },
            links: {
              GetDeclarativeGreetingItem: {
                operationId: 'getDeclarativeGreetingItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /declarative_greetings/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Replaces the DeclarativeGreeting resource.',
        description: 'Replaces the DeclarativeGreeting resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated DeclarativeGreeting resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/DeclarativeGreeting.jsonld',
              },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/DeclarativeGreeting' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/DeclarativeGreeting' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      delete: {
        operationId: 'deleteDeclarativeGreetingItem',
        tags: ['DeclarativeGreeting'],
        responses: {
          '204': { description: 'DeclarativeGreeting resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the DeclarativeGreeting resource.',
        description: 'Removes the DeclarativeGreeting resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      patch: {
        operationId: 'patchDeclarativeGreetingItem',
        tags: ['DeclarativeGreeting'],
        responses: {
          '200': {
            description: 'DeclarativeGreeting resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/DeclarativeGreeting.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/DeclarativeGreeting' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/DeclarativeGreeting' },
              },
            },
            links: {
              GetDeclarativeGreetingItem: {
                operationId: 'getDeclarativeGreetingItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /declarative_greetings/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Updates the DeclarativeGreeting resource.',
        description: 'Updates the DeclarativeGreeting resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated DeclarativeGreeting resource',
          content: {
            'application/merge-patch+json': {
              schema: { $ref: '#/components/schemas/DeclarativeGreeting' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/documents': {
      get: {
        operationId: 'getDocumentCollection',
        tags: ['Document'],
        responses: {
          '200': {
            description: 'Document collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Document.jsonld',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Document' },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Document' },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of Document resources.',
        description: 'Retrieves the collection of Document resources.',
        parameters: [
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      post: {
        operationId: 'postDocumentCollection',
        tags: ['Document'],
        responses: {
          '201': {
            description: 'Document resource created',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Document.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Document' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Document' },
              },
            },
            links: {
              GetDocumentItem: {
                operationId: 'getDocumentItem',
                parameters: { indexName: '$response.body#/indexName' },
                description:
                  'The `indexName` value returned in the response can be used as the `indexName` parameter in `GET /documents/{indexName}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
        },
        summary: 'Creates a Document resource.',
        description: 'Creates a Document resource.',
        parameters: [],
        requestBody: {
          description: 'The new Document resource',
          content: {
            'application/ld+json': {
              schema: { $ref: '#/components/schemas/Document.jsonld' },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/Document' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/Document' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/documents/{indexName}': {
      get: {
        operationId: 'getDocumentItem',
        tags: ['Document'],
        responses: {
          '200': {
            description: 'Document resource',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Document.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Document' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Document' },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a Document resource.',
        description: 'Retrieves a Document resource.',
        parameters: [
          {
            name: 'indexName',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      delete: {
        operationId: 'deleteDocumentItem',
        tags: ['Document'],
        responses: {
          '204': { description: 'Document resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the Document resource.',
        description: 'Removes the Document resource.',
        parameters: [
          {
            name: 'indexName',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      parameters: [],
    },
    '/example_categories': {
      get: {
        operationId: 'getExampleCategoryCollection',
        tags: ['ExampleCategory'],
        responses: {
          '200': {
            description: 'ExampleCategory collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/ExampleCategory.jsonld',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ExampleCategory' },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ExampleCategory' },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of ExampleCategory resources.',
        description: 'Retrieves the collection of ExampleCategory resources.',
        parameters: [
          {
            name: 'currentPage',
            in: 'query',
            description: 'The collection page number',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 1 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'The number of items per page',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 30, minimum: 0 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      post: {
        operationId: 'postExampleCategoryCollection',
        tags: ['ExampleCategory'],
        responses: {
          '201': {
            description: 'ExampleCategory resource created',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/ExampleCategory.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/ExampleCategory' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/ExampleCategory' },
              },
            },
            links: {
              GetExampleCategoryItem: {
                operationId: 'getExampleCategoryItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /example_categories/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
        },
        summary: 'Creates a ExampleCategory resource.',
        description: 'Creates a ExampleCategory resource.',
        parameters: [],
        requestBody: {
          description: 'The new ExampleCategory resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/ExampleCategory.jsonld',
              },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/ExampleCategory' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/ExampleCategory' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/example_categories/{id}': {
      get: {
        operationId: 'getExampleCategoryItem',
        tags: ['ExampleCategory'],
        responses: {
          '200': {
            description: 'ExampleCategory resource',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/ExampleCategory.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/ExampleCategory' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/ExampleCategory' },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a ExampleCategory resource.',
        description: 'Retrieves a ExampleCategory resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      put: {
        operationId: 'putExampleCategoryItem',
        tags: ['ExampleCategory'],
        responses: {
          '200': {
            description: 'ExampleCategory resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/ExampleCategory.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/ExampleCategory' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/ExampleCategory' },
              },
            },
            links: {
              GetExampleCategoryItem: {
                operationId: 'getExampleCategoryItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /example_categories/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Replaces the ExampleCategory resource.',
        description: 'Replaces the ExampleCategory resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated ExampleCategory resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/ExampleCategory.jsonld',
              },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/ExampleCategory' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/ExampleCategory' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      delete: {
        operationId: 'deleteExampleCategoryItem',
        tags: ['ExampleCategory'],
        responses: {
          '204': { description: 'ExampleCategory resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the ExampleCategory resource.',
        description: 'Removes the ExampleCategory resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      patch: {
        operationId: 'patchExampleCategoryItem',
        tags: ['ExampleCategory'],
        responses: {
          '200': {
            description: 'ExampleCategory resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/ExampleCategory.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/ExampleCategory' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/ExampleCategory' },
              },
            },
            links: {
              GetExampleCategoryItem: {
                operationId: 'getExampleCategoryItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /example_categories/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Updates the ExampleCategory resource.',
        description: 'Updates the ExampleCategory resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated ExampleCategory resource',
          content: {
            'application/merge-patch+json': {
              schema: { $ref: '#/components/schemas/ExampleCategory' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/example_documents': {
      get: {
        operationId: 'getExampleDocumentCollection',
        tags: ['ExampleDocument'],
        responses: {
          '200': {
            description: 'ExampleDocument collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/ExampleDocument.jsonld',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ExampleDocument' },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ExampleDocument' },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of ExampleDocument resources.',
        description: 'Retrieves the collection of ExampleDocument resources.',
        parameters: [
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      post: {
        operationId: 'postExampleDocumentCollection',
        tags: ['ExampleDocument'],
        responses: {
          '201': {
            description: 'ExampleDocument resource created',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/ExampleDocument.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/ExampleDocument' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/ExampleDocument' },
              },
            },
            links: {
              GetExampleDocumentItem: {
                operationId: 'getExampleDocumentItem',
                parameters: { indexName: '$response.body#/indexName' },
                description:
                  'The `indexName` value returned in the response can be used as the `indexName` parameter in `GET /example_documents/{indexName}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
        },
        summary: 'Creates a ExampleDocument resource.',
        description: 'Creates a ExampleDocument resource.',
        parameters: [],
        requestBody: {
          description: 'The new ExampleDocument resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/ExampleDocument.jsonld',
              },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/ExampleDocument' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/ExampleDocument' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/example_documents/{indexName}': {
      get: {
        operationId: 'getExampleDocumentItem',
        tags: ['ExampleDocument'],
        responses: {
          '200': {
            description: 'ExampleDocument resource',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/ExampleDocument.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/ExampleDocument' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/ExampleDocument' },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a ExampleDocument resource.',
        description: 'Retrieves a ExampleDocument resource.',
        parameters: [
          {
            name: 'indexName',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      delete: {
        operationId: 'deleteExampleDocumentItem',
        tags: ['ExampleDocument'],
        responses: {
          '204': { description: 'ExampleDocument resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the ExampleDocument resource.',
        description: 'Removes the ExampleDocument resource.',
        parameters: [
          {
            name: 'indexName',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      parameters: [],
    },
    '/example_indices': {
      get: {
        operationId: 'getExampleIndexCollection',
        tags: ['ExampleIndex'],
        responses: {
          '200': {
            description: 'ExampleIndex collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/ExampleIndex.jsonld',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ExampleIndex' },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ExampleIndex' },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of ExampleIndex resources.',
        description: 'Retrieves the collection of ExampleIndex resources.',
        parameters: [
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      post: {
        operationId: 'postExampleIndexCollection',
        tags: ['ExampleIndex'],
        responses: {
          '201': {
            description: 'ExampleIndex resource created',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/ExampleIndex.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/ExampleIndex' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/ExampleIndex' },
              },
            },
            links: {
              GetExampleIndexItem: {
                operationId: 'getExampleIndexItem',
                parameters: { name: '$response.body#/name' },
                description:
                  'The `name` value returned in the response can be used as the `name` parameter in `GET /example_indices/{name}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
        },
        summary: 'Creates a ExampleIndex resource.',
        description: 'Creates a ExampleIndex resource.',
        parameters: [],
        requestBody: {
          description: 'The new ExampleIndex resource',
          content: {
            'application/ld+json': {
              schema: { $ref: '#/components/schemas/ExampleIndex.jsonld' },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/ExampleIndex' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/ExampleIndex' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/example_indices/{name}': {
      get: {
        operationId: 'getExampleIndexItem',
        tags: ['ExampleIndex'],
        responses: {
          '200': {
            description: 'ExampleIndex resource',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/ExampleIndex.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/ExampleIndex' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/ExampleIndex' },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a ExampleIndex resource.',
        description: 'Retrieves a ExampleIndex resource.',
        parameters: [
          {
            name: 'name',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      delete: {
        operationId: 'deleteExampleIndexItem',
        tags: ['ExampleIndex'],
        responses: {
          '204': { description: 'ExampleIndex resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the ExampleIndex resource.',
        description: 'Removes the ExampleIndex resource.',
        parameters: [
          {
            name: 'name',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      parameters: [],
    },
    '/example_products': {
      get: {
        operationId: 'getExampleProductCollection',
        tags: ['ExampleProduct'],
        responses: {
          '200': {
            description: 'ExampleProduct collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/ExampleProduct.jsonld',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ExampleProduct' },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ExampleProduct' },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of ExampleProduct resources.',
        description: 'Retrieves the collection of ExampleProduct resources.',
        parameters: [
          {
            name: 'currentPage',
            in: 'query',
            description: 'The collection page number',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 1 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'The number of items per page',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: {
              type: 'integer',
              default: 2,
              minimum: 0,
              maximum: 10,
            },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'type_id',
            in: 'query',
            description: '',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'string' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'type_id[]',
            in: 'query',
            description: '',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'string' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      parameters: [],
    },
    '/example_products/{entity_id}': {
      get: {
        operationId: 'getExampleProductItem',
        tags: ['ExampleProduct'],
        responses: {
          '200': {
            description: 'ExampleProduct resource',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/ExampleProduct.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/ExampleProduct' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/ExampleProduct' },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a ExampleProduct resource.',
        description: 'Retrieves a ExampleProduct resource.',
        parameters: [
          {
            name: 'entity_id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      parameters: [],
    },
    '/example_result_documents/{id}': {
      get: {
        operationId: 'getExampleResultDocumentItem',
        tags: ['ExampleResultDocument'],
        responses: {
          '204': {
            description: 'ExampleResultDocument resource',
            content: {
              'application/ld+json': { schema: {} },
              'application/json': { schema: {} },
              'text/html': { schema: {} },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a ExampleResultDocument resource.',
        description: 'Retrieves a ExampleResultDocument resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      parameters: [],
    },
    '/facet_configurations': {
      get: {
        operationId: 'getFacetConfigurationCollection',
        tags: ['FacetConfiguration'],
        responses: {
          '200': {
            description: 'FacetConfiguration collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/FacetConfiguration.jsonld-facet_configuration.read',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/FacetConfiguration-facet_configuration.read',
                  },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/FacetConfiguration-facet_configuration.read',
                  },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of FacetConfiguration resources.',
        description:
          'Retrieves the collection of FacetConfiguration resources.',
        parameters: [
          {
            name: 'currentPage',
            in: 'query',
            description: 'The collection page number',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 1 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'The number of items per page',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 30, minimum: 0 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'category',
            in: 'query',
            description: '',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'string' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'category[]',
            in: 'query',
            description: '',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'array', items: { type: 'string' } },
            style: 'form',
            explode: true,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      parameters: [],
    },
    '/facet_configurations/{id}': {
      get: {
        operationId: 'getFacetConfigurationItem',
        tags: ['FacetConfiguration'],
        responses: {
          '200': {
            description: 'FacetConfiguration resource',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/FacetConfiguration.jsonld-facet_configuration.read',
                },
              },
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FacetConfiguration-facet_configuration.read',
                },
              },
              'text/html': {
                schema: {
                  $ref: '#/components/schemas/FacetConfiguration-facet_configuration.read',
                },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a FacetConfiguration resource.',
        description: 'Retrieves a FacetConfiguration resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      put: {
        operationId: 'putFacetConfigurationItem',
        tags: ['FacetConfiguration'],
        responses: {
          '200': {
            description: 'FacetConfiguration resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/FacetConfiguration.jsonld-facet_configuration.read',
                },
              },
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FacetConfiguration-facet_configuration.read',
                },
              },
              'text/html': {
                schema: {
                  $ref: '#/components/schemas/FacetConfiguration-facet_configuration.read',
                },
              },
            },
            links: {
              GetFacetConfigurationItem: {
                operationId: 'getFacetConfigurationItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /facet_configurations/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Replaces the FacetConfiguration resource.',
        description: 'Replaces the FacetConfiguration resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated FacetConfiguration resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/FacetConfiguration.jsonld-facet_configuration.write',
              },
            },
            'application/json': {
              schema: {
                $ref: '#/components/schemas/FacetConfiguration-facet_configuration.write',
              },
            },
            'text/html': {
              schema: {
                $ref: '#/components/schemas/FacetConfiguration-facet_configuration.write',
              },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      delete: {
        operationId: 'deleteFacetConfigurationItem',
        tags: ['FacetConfiguration'],
        responses: {
          '204': { description: 'FacetConfiguration resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the FacetConfiguration resource.',
        description: 'Removes the FacetConfiguration resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      patch: {
        operationId: 'patchFacetConfigurationItem',
        tags: ['FacetConfiguration'],
        responses: {
          '200': {
            description: 'FacetConfiguration resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/FacetConfiguration.jsonld-facet_configuration.read',
                },
              },
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FacetConfiguration-facet_configuration.read',
                },
              },
              'text/html': {
                schema: {
                  $ref: '#/components/schemas/FacetConfiguration-facet_configuration.read',
                },
              },
            },
            links: {
              GetFacetConfigurationItem: {
                operationId: 'getFacetConfigurationItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /facet_configurations/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Updates the FacetConfiguration resource.',
        description: 'Updates the FacetConfiguration resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated FacetConfiguration resource',
          content: {
            'application/merge-patch+json': {
              schema: {
                $ref: '#/components/schemas/FacetConfiguration-facet_configuration.write',
              },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/indices': {
      get: {
        operationId: 'getIndexCollection',
        tags: ['Index'],
        responses: {
          '200': {
            description: 'Index collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Index.jsonld-list',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Index-list' },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Index-list' },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of Index resources.',
        description: 'Retrieves the collection of Index resources.',
        parameters: [
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      post: {
        operationId: 'postIndexCollection',
        tags: ['Index'],
        responses: {
          '201': {
            description: 'Index resource created',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Index.jsonld-create' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Index-create' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Index-create' },
              },
            },
            links: {
              GetIndexItem: {
                operationId: 'getIndexItem',
                parameters: { name: '$response.body#/name' },
                description:
                  'The `name` value returned in the response can be used as the `name` parameter in `GET /indices/{name}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
        },
        summary: 'Creates a Index resource.',
        description: 'Creates a Index resource.',
        parameters: [],
        requestBody: {
          description: 'The new Index resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/Index.CreateIndexInput.jsonld-create',
              },
            },
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Index.CreateIndexInput-create',
              },
            },
            'text/html': {
              schema: {
                $ref: '#/components/schemas/Index.CreateIndexInput-create',
              },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/indices/install/{name}': {
      put: {
        operationId: 'installIndexItem',
        tags: ['Index'],
        responses: {
          '200': {
            description: 'Index resource updated',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Index.jsonld-list' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Index-list' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Index-list' },
              },
            },
            links: {
              GetIndexItem: {
                operationId: 'getIndexItem',
                parameters: { name: '$response.body#/name' },
                description:
                  'The `name` value returned in the response can be used as the `name` parameter in `GET /indices/{name}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Installs an Index resource',
        description: 'Installs an Index resource',
        parameters: [
          {
            name: 'name',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated Index resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/Index.InstallIndexInput.jsonld-list',
              },
            },
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Index.InstallIndexInput-list',
              },
            },
            'text/html': {
              schema: {
                $ref: '#/components/schemas/Index.InstallIndexInput-list',
              },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/indices/refresh/{name}': {
      put: {
        operationId: 'refreshIndexItem',
        tags: ['Index'],
        responses: {
          '200': {
            description: 'Index resource updated',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Index.jsonld-list' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Index-list' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Index-list' },
              },
            },
            links: {
              GetIndexItem: {
                operationId: 'getIndexItem',
                parameters: { name: '$response.body#/name' },
                description:
                  'The `name` value returned in the response can be used as the `name` parameter in `GET /indices/{name}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Refreshes an Index resource',
        description: 'Refreshes an Index resource',
        parameters: [
          {
            name: 'name',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated Index resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/Index.RefreshIndexInput.jsonld-list',
              },
            },
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Index.RefreshIndexInput-list',
              },
            },
            'text/html': {
              schema: {
                $ref: '#/components/schemas/Index.RefreshIndexInput-list',
              },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/indices/{name}': {
      get: {
        operationId: 'getIndexItem',
        tags: ['Index'],
        responses: {
          '200': {
            description: 'Index resource',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/Index.jsonld-details',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Index-details' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Index-details' },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a Index resource.',
        description: 'Retrieves a Index resource.',
        parameters: [
          {
            name: 'name',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      delete: {
        operationId: 'deleteIndexItem',
        tags: ['Index'],
        responses: {
          '204': { description: 'Index resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the Index resource.',
        description: 'Removes the Index resource.',
        parameters: [
          {
            name: 'name',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      parameters: [],
    },
    '/localized_catalogs': {
      get: {
        operationId: 'getLocalizedCatalogCollection',
        tags: ['LocalizedCatalog'],
        responses: {
          '200': {
            description: 'LocalizedCatalog collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/LocalizedCatalog.jsonld',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/LocalizedCatalog' },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/LocalizedCatalog' },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of LocalizedCatalog resources.',
        description: 'Retrieves the collection of LocalizedCatalog resources.',
        parameters: [
          {
            name: 'currentPage',
            in: 'query',
            description: 'The collection page number',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 1 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'The number of items per page',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 30, minimum: 0 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      post: {
        operationId: 'postLocalizedCatalogCollection',
        tags: ['LocalizedCatalog'],
        responses: {
          '201': {
            description: 'LocalizedCatalog resource created',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/LocalizedCatalog.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/LocalizedCatalog' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/LocalizedCatalog' },
              },
            },
            links: {
              GetLocalizedCatalogItem: {
                operationId: 'getLocalizedCatalogItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /localized_catalogs/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
        },
        summary: 'Creates a LocalizedCatalog resource.',
        description: 'Creates a LocalizedCatalog resource.',
        parameters: [],
        requestBody: {
          description: 'The new LocalizedCatalog resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/LocalizedCatalog.jsonld',
              },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/LocalizedCatalog' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/LocalizedCatalog' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/localized_catalogs/{id}': {
      get: {
        operationId: 'getLocalizedCatalogItem',
        tags: ['LocalizedCatalog'],
        responses: {
          '200': {
            description: 'LocalizedCatalog resource',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/LocalizedCatalog.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/LocalizedCatalog' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/LocalizedCatalog' },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a LocalizedCatalog resource.',
        description: 'Retrieves a LocalizedCatalog resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      put: {
        operationId: 'putLocalizedCatalogItem',
        tags: ['LocalizedCatalog'],
        responses: {
          '200': {
            description: 'LocalizedCatalog resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/LocalizedCatalog.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/LocalizedCatalog' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/LocalizedCatalog' },
              },
            },
            links: {
              GetLocalizedCatalogItem: {
                operationId: 'getLocalizedCatalogItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /localized_catalogs/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Replaces the LocalizedCatalog resource.',
        description: 'Replaces the LocalizedCatalog resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated LocalizedCatalog resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/LocalizedCatalog.jsonld',
              },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/LocalizedCatalog' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/LocalizedCatalog' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      delete: {
        operationId: 'deleteLocalizedCatalogItem',
        tags: ['LocalizedCatalog'],
        responses: {
          '204': { description: 'LocalizedCatalog resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the LocalizedCatalog resource.',
        description: 'Removes the LocalizedCatalog resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      patch: {
        operationId: 'patchLocalizedCatalogItem',
        tags: ['LocalizedCatalog'],
        responses: {
          '200': {
            description: 'LocalizedCatalog resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/LocalizedCatalog.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/LocalizedCatalog' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/LocalizedCatalog' },
              },
            },
            links: {
              GetLocalizedCatalogItem: {
                operationId: 'getLocalizedCatalogItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /localized_catalogs/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Updates the LocalizedCatalog resource.',
        description: 'Updates the LocalizedCatalog resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated LocalizedCatalog resource',
          content: {
            'application/merge-patch+json': {
              schema: { $ref: '#/components/schemas/LocalizedCatalog' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/mapping_statuses/{entityType}': {
      get: {
        operationId: 'getMappingStatusItem',
        tags: ['MappingStatus'],
        responses: {
          '200': {
            description: 'MappingStatus resource',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/MappingStatus.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/MappingStatus' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/MappingStatus' },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a MappingStatus resource.',
        description: 'Retrieves a MappingStatus resource.',
        parameters: [
          {
            name: 'entityType',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      parameters: [],
    },
    '/menu': {
      get: {
        operationId: 'menuMenuItem',
        tags: ['Menu'],
        responses: {
          '200': {
            description: 'Menu resource',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Menu.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Menu' },
              },
              'text/html': { schema: { $ref: '#/components/schemas/Menu' } },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a Menu resource.',
        description: 'Retrieves a Menu resource.',
        parameters: [
          {
            name: 'code',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      parameters: [],
    },
    '/metadata': {
      get: {
        operationId: 'getMetadataCollection',
        tags: ['Metadata'],
        responses: {
          '200': {
            description: 'Metadata collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Metadata.jsonld',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Metadata' },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Metadata' },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of Metadata resources.',
        description: 'Retrieves the collection of Metadata resources.',
        parameters: [
          {
            name: 'currentPage',
            in: 'query',
            description: 'The collection page number',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 1 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'The number of items per page',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 30, minimum: 0 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      post: {
        operationId: 'postMetadataCollection',
        tags: ['Metadata'],
        responses: {
          '201': {
            description: 'Metadata resource created',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Metadata.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Metadata' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Metadata' },
              },
            },
            links: {
              GetMetadataItem: {
                operationId: 'getMetadataItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /metadata/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
        },
        summary: 'Creates a Metadata resource.',
        description: 'Creates a Metadata resource.',
        parameters: [],
        requestBody: {
          description: 'The new Metadata resource',
          content: {
            'application/ld+json': {
              schema: { $ref: '#/components/schemas/Metadata.jsonld' },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/Metadata' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/Metadata' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/metadata/{id}': {
      get: {
        operationId: 'getMetadataItem',
        tags: ['Metadata'],
        responses: {
          '200': {
            description: 'Metadata resource',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Metadata.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Metadata' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Metadata' },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a Metadata resource.',
        description: 'Retrieves a Metadata resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      put: {
        operationId: 'putMetadataItem',
        tags: ['Metadata'],
        responses: {
          '200': {
            description: 'Metadata resource updated',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Metadata.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Metadata' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Metadata' },
              },
            },
            links: {
              GetMetadataItem: {
                operationId: 'getMetadataItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /metadata/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Replaces the Metadata resource.',
        description: 'Replaces the Metadata resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated Metadata resource',
          content: {
            'application/ld+json': {
              schema: { $ref: '#/components/schemas/Metadata.jsonld' },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/Metadata' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/Metadata' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      delete: {
        operationId: 'deleteMetadataItem',
        tags: ['Metadata'],
        responses: {
          '204': { description: 'Metadata resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the Metadata resource.',
        description: 'Removes the Metadata resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      patch: {
        operationId: 'patchMetadataItem',
        tags: ['Metadata'],
        responses: {
          '200': {
            description: 'Metadata resource updated',
            content: {
              'application/ld+json': {
                schema: { $ref: '#/components/schemas/Metadata.jsonld' },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/Metadata' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/Metadata' },
              },
            },
            links: {
              GetMetadataItem: {
                operationId: 'getMetadataItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /metadata/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Updates the Metadata resource.',
        description: 'Updates the Metadata resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated Metadata resource',
          content: {
            'application/merge-patch+json': {
              schema: { $ref: '#/components/schemas/Metadata' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/source_field_labels': {
      get: {
        operationId: 'getSourceFieldLabelCollection',
        tags: ['SourceFieldLabel'],
        responses: {
          '200': {
            description: 'SourceFieldLabel collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/SourceFieldLabel.jsonld',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/SourceFieldLabel' },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/SourceFieldLabel' },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of SourceFieldLabel resources.',
        description: 'Retrieves the collection of SourceFieldLabel resources.',
        parameters: [
          {
            name: 'currentPage',
            in: 'query',
            description: 'The collection page number',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 1 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'The number of items per page',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 30, minimum: 0 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      post: {
        operationId: 'postSourceFieldLabelCollection',
        tags: ['SourceFieldLabel'],
        responses: {
          '201': {
            description: 'SourceFieldLabel resource created',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldLabel.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/SourceFieldLabel' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/SourceFieldLabel' },
              },
            },
            links: {
              GetSourceFieldLabelItem: {
                operationId: 'getSourceFieldLabelItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /source_field_labels/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
        },
        summary: 'Creates a SourceFieldLabel resource.',
        description: 'Creates a SourceFieldLabel resource.',
        parameters: [],
        requestBody: {
          description: 'The new SourceFieldLabel resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/SourceFieldLabel.jsonld',
              },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/SourceFieldLabel' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/SourceFieldLabel' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/source_field_labels/{id}': {
      get: {
        operationId: 'getSourceFieldLabelItem',
        tags: ['SourceFieldLabel'],
        responses: {
          '200': {
            description: 'SourceFieldLabel resource',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldLabel.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/SourceFieldLabel' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/SourceFieldLabel' },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a SourceFieldLabel resource.',
        description: 'Retrieves a SourceFieldLabel resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      put: {
        operationId: 'putSourceFieldLabelItem',
        tags: ['SourceFieldLabel'],
        responses: {
          '200': {
            description: 'SourceFieldLabel resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldLabel.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/SourceFieldLabel' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/SourceFieldLabel' },
              },
            },
            links: {
              GetSourceFieldLabelItem: {
                operationId: 'getSourceFieldLabelItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /source_field_labels/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Replaces the SourceFieldLabel resource.',
        description: 'Replaces the SourceFieldLabel resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated SourceFieldLabel resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/SourceFieldLabel.jsonld',
              },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/SourceFieldLabel' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/SourceFieldLabel' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      delete: {
        operationId: 'deleteSourceFieldLabelItem',
        tags: ['SourceFieldLabel'],
        responses: {
          '204': { description: 'SourceFieldLabel resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the SourceFieldLabel resource.',
        description: 'Removes the SourceFieldLabel resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      patch: {
        operationId: 'patchSourceFieldLabelItem',
        tags: ['SourceFieldLabel'],
        responses: {
          '200': {
            description: 'SourceFieldLabel resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldLabel.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/SourceFieldLabel' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/SourceFieldLabel' },
              },
            },
            links: {
              GetSourceFieldLabelItem: {
                operationId: 'getSourceFieldLabelItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /source_field_labels/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Updates the SourceFieldLabel resource.',
        description: 'Updates the SourceFieldLabel resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated SourceFieldLabel resource',
          content: {
            'application/merge-patch+json': {
              schema: { $ref: '#/components/schemas/SourceFieldLabel' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/source_field_option_labels': {
      get: {
        operationId: 'getSourceFieldOptionLabelCollection',
        tags: ['SourceFieldOptionLabel'],
        responses: {
          '200': {
            description: 'SourceFieldOptionLabel collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/SourceFieldOptionLabel.jsonld',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/SourceFieldOptionLabel',
                  },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/SourceFieldOptionLabel',
                  },
                },
              },
            },
          },
        },
        summary:
          'Retrieves the collection of SourceFieldOptionLabel resources.',
        description:
          'Retrieves the collection of SourceFieldOptionLabel resources.',
        parameters: [
          {
            name: 'currentPage',
            in: 'query',
            description: 'The collection page number',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 1 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'The number of items per page',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 30, minimum: 0 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      post: {
        operationId: 'postSourceFieldOptionLabelCollection',
        tags: ['SourceFieldOptionLabel'],
        responses: {
          '201': {
            description: 'SourceFieldOptionLabel resource created',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOptionLabel.jsonld',
                },
              },
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOptionLabel',
                },
              },
              'text/html': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOptionLabel',
                },
              },
            },
            links: {
              GetSourceFieldOptionLabelItem: {
                operationId: 'getSourceFieldOptionLabelItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /source_field_option_labels/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
        },
        summary: 'Creates a SourceFieldOptionLabel resource.',
        description: 'Creates a SourceFieldOptionLabel resource.',
        parameters: [],
        requestBody: {
          description: 'The new SourceFieldOptionLabel resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/SourceFieldOptionLabel.jsonld',
              },
            },
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SourceFieldOptionLabel',
              },
            },
            'text/html': {
              schema: {
                $ref: '#/components/schemas/SourceFieldOptionLabel',
              },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/source_field_option_labels/{id}': {
      get: {
        operationId: 'getSourceFieldOptionLabelItem',
        tags: ['SourceFieldOptionLabel'],
        responses: {
          '200': {
            description: 'SourceFieldOptionLabel resource',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOptionLabel.jsonld',
                },
              },
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOptionLabel',
                },
              },
              'text/html': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOptionLabel',
                },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a SourceFieldOptionLabel resource.',
        description: 'Retrieves a SourceFieldOptionLabel resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      put: {
        operationId: 'putSourceFieldOptionLabelItem',
        tags: ['SourceFieldOptionLabel'],
        responses: {
          '200': {
            description: 'SourceFieldOptionLabel resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOptionLabel.jsonld',
                },
              },
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOptionLabel',
                },
              },
              'text/html': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOptionLabel',
                },
              },
            },
            links: {
              GetSourceFieldOptionLabelItem: {
                operationId: 'getSourceFieldOptionLabelItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /source_field_option_labels/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Replaces the SourceFieldOptionLabel resource.',
        description: 'Replaces the SourceFieldOptionLabel resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated SourceFieldOptionLabel resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/SourceFieldOptionLabel.jsonld',
              },
            },
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SourceFieldOptionLabel',
              },
            },
            'text/html': {
              schema: {
                $ref: '#/components/schemas/SourceFieldOptionLabel',
              },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      delete: {
        operationId: 'deleteSourceFieldOptionLabelItem',
        tags: ['SourceFieldOptionLabel'],
        responses: {
          '204': { description: 'SourceFieldOptionLabel resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the SourceFieldOptionLabel resource.',
        description: 'Removes the SourceFieldOptionLabel resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      patch: {
        operationId: 'patchSourceFieldOptionLabelItem',
        tags: ['SourceFieldOptionLabel'],
        responses: {
          '200': {
            description: 'SourceFieldOptionLabel resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOptionLabel.jsonld',
                },
              },
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOptionLabel',
                },
              },
              'text/html': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOptionLabel',
                },
              },
            },
            links: {
              GetSourceFieldOptionLabelItem: {
                operationId: 'getSourceFieldOptionLabelItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /source_field_option_labels/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Updates the SourceFieldOptionLabel resource.',
        description: 'Updates the SourceFieldOptionLabel resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated SourceFieldOptionLabel resource',
          content: {
            'application/merge-patch+json': {
              schema: {
                $ref: '#/components/schemas/SourceFieldOptionLabel',
              },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/source_field_options': {
      get: {
        operationId: 'getSourceFieldOptionCollection',
        tags: ['SourceFieldOption'],
        responses: {
          '200': {
            description: 'SourceFieldOption collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/SourceFieldOption.jsonld',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/SourceFieldOption' },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/SourceFieldOption' },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of SourceFieldOption resources.',
        description: 'Retrieves the collection of SourceFieldOption resources.',
        parameters: [
          {
            name: 'currentPage',
            in: 'query',
            description: 'The collection page number',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 1 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'The number of items per page',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 30, minimum: 0 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      post: {
        operationId: 'postSourceFieldOptionCollection',
        tags: ['SourceFieldOption'],
        responses: {
          '201': {
            description: 'SourceFieldOption resource created',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOption.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/SourceFieldOption' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/SourceFieldOption' },
              },
            },
            links: {
              GetSourceFieldOptionItem: {
                operationId: 'getSourceFieldOptionItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /source_field_options/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
        },
        summary: 'Creates a SourceFieldOption resource.',
        description: 'Creates a SourceFieldOption resource.',
        parameters: [],
        requestBody: {
          description: 'The new SourceFieldOption resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/SourceFieldOption.jsonld',
              },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/SourceFieldOption' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/SourceFieldOption' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/source_field_options/{id}': {
      get: {
        operationId: 'getSourceFieldOptionItem',
        tags: ['SourceFieldOption'],
        responses: {
          '200': {
            description: 'SourceFieldOption resource',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOption.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/SourceFieldOption' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/SourceFieldOption' },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a SourceFieldOption resource.',
        description: 'Retrieves a SourceFieldOption resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      put: {
        operationId: 'putSourceFieldOptionItem',
        tags: ['SourceFieldOption'],
        responses: {
          '200': {
            description: 'SourceFieldOption resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOption.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/SourceFieldOption' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/SourceFieldOption' },
              },
            },
            links: {
              GetSourceFieldOptionItem: {
                operationId: 'getSourceFieldOptionItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /source_field_options/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Replaces the SourceFieldOption resource.',
        description: 'Replaces the SourceFieldOption resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated SourceFieldOption resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/SourceFieldOption.jsonld',
              },
            },
            'application/json': {
              schema: { $ref: '#/components/schemas/SourceFieldOption' },
            },
            'text/html': {
              schema: { $ref: '#/components/schemas/SourceFieldOption' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      delete: {
        operationId: 'deleteSourceFieldOptionItem',
        tags: ['SourceFieldOption'],
        responses: {
          '204': { description: 'SourceFieldOption resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the SourceFieldOption resource.',
        description: 'Removes the SourceFieldOption resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      patch: {
        operationId: 'patchSourceFieldOptionItem',
        tags: ['SourceFieldOption'],
        responses: {
          '200': {
            description: 'SourceFieldOption resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceFieldOption.jsonld',
                },
              },
              'application/json': {
                schema: { $ref: '#/components/schemas/SourceFieldOption' },
              },
              'text/html': {
                schema: { $ref: '#/components/schemas/SourceFieldOption' },
              },
            },
            links: {
              GetSourceFieldOptionItem: {
                operationId: 'getSourceFieldOptionItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /source_field_options/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Updates the SourceFieldOption resource.',
        description: 'Updates the SourceFieldOption resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated SourceFieldOption resource',
          content: {
            'application/merge-patch+json': {
              schema: { $ref: '#/components/schemas/SourceFieldOption' },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/source_fields': {
      get: {
        operationId: 'getSourceFieldCollection',
        tags: ['SourceField'],
        responses: {
          '200': {
            description: 'SourceField collection',
            content: {
              'application/ld+json': {
                schema: {
                  type: 'object',
                  properties: {
                    'hydra:member': {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/SourceField.jsonld-source_field.api',
                      },
                    },
                    'hydra:totalItems': { type: 'integer', minimum: 0 },
                    'hydra:view': {
                      type: 'object',
                      properties: {
                        '@id': { type: 'string', format: 'iri-reference' },
                        '@type': { type: 'string' },
                        'hydra:first': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:last': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:previous': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                        'hydra:next': {
                          type: 'string',
                          format: 'iri-reference',
                        },
                      },
                    },
                    'hydra:search': {
                      type: 'object',
                      properties: {
                        '@type': { type: 'string' },
                        'hydra:template': { type: 'string' },
                        'hydra:variableRepresentation': { type: 'string' },
                        'hydra:mapping': {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              '@type': { type: 'string' },
                              variable: { type: 'string' },
                              property: {
                                type: 'string',
                                nullable: true,
                              },
                              required: { type: 'boolean' },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ['hydra:member'],
                },
              },
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/SourceField-source_field.api',
                  },
                },
              },
              'text/html': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/SourceField-source_field.api',
                  },
                },
              },
            },
          },
        },
        summary: 'Retrieves the collection of SourceField resources.',
        description: 'Retrieves the collection of SourceField resources.',
        parameters: [
          {
            name: 'currentPage',
            in: 'query',
            description: 'The collection page number',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 1 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'The number of items per page',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'integer', default: 30, minimum: 0 },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
          {
            name: 'pagination',
            in: 'query',
            description: 'Enable or disable pagination',
            required: false,
            deprecated: false,
            allowEmptyValue: true,
            schema: { type: 'boolean' },
            style: 'form',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      post: {
        operationId: 'postSourceFieldCollection',
        tags: ['SourceField'],
        responses: {
          '201': {
            description: 'SourceField resource created',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceField.jsonld-source_field.api',
                },
              },
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SourceField-source_field.api',
                },
              },
              'text/html': {
                schema: {
                  $ref: '#/components/schemas/SourceField-source_field.api',
                },
              },
            },
            links: {
              GetSourceFieldItem: {
                operationId: 'getSourceFieldItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /source_fields/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
        },
        summary: 'Creates a SourceField resource.',
        description: 'Creates a SourceField resource.',
        parameters: [],
        requestBody: {
          description: 'The new SourceField resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/SourceField.jsonld-source_field.api',
              },
            },
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SourceField-source_field.api',
              },
            },
            'text/html': {
              schema: {
                $ref: '#/components/schemas/SourceField-source_field.api',
              },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
    '/source_fields/{id}': {
      get: {
        operationId: 'getSourceFieldItem',
        tags: ['SourceField'],
        responses: {
          '200': {
            description: 'SourceField resource',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceField.jsonld-source_field.api',
                },
              },
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SourceField-source_field.api',
                },
              },
              'text/html': {
                schema: {
                  $ref: '#/components/schemas/SourceField-source_field.api',
                },
              },
            },
          },
          '404': { description: 'Resource not found' },
        },
        summary: 'Retrieves a SourceField resource.',
        description: 'Retrieves a SourceField resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      put: {
        operationId: 'putSourceFieldItem',
        tags: ['SourceField'],
        responses: {
          '200': {
            description: 'SourceField resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceField.jsonld-source_field.api',
                },
              },
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SourceField-source_field.api',
                },
              },
              'text/html': {
                schema: {
                  $ref: '#/components/schemas/SourceField-source_field.api',
                },
              },
            },
            links: {
              GetSourceFieldItem: {
                operationId: 'getSourceFieldItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /source_fields/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Replaces the SourceField resource.',
        description: 'Replaces the SourceField resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated SourceField resource',
          content: {
            'application/ld+json': {
              schema: {
                $ref: '#/components/schemas/SourceField.jsonld-source_field.api',
              },
            },
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SourceField-source_field.api',
              },
            },
            'text/html': {
              schema: {
                $ref: '#/components/schemas/SourceField-source_field.api',
              },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      delete: {
        operationId: 'deleteSourceFieldItem',
        tags: ['SourceField'],
        responses: {
          '204': { description: 'SourceField resource deleted' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Removes the SourceField resource.',
        description: 'Removes the SourceField resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        deprecated: false,
      },
      patch: {
        operationId: 'patchSourceFieldItem',
        tags: ['SourceField'],
        responses: {
          '200': {
            description: 'SourceField resource updated',
            content: {
              'application/ld+json': {
                schema: {
                  $ref: '#/components/schemas/SourceField.jsonld-source_field.api',
                },
              },
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SourceField-source_field.api',
                },
              },
              'text/html': {
                schema: {
                  $ref: '#/components/schemas/SourceField-source_field.api',
                },
              },
            },
            links: {
              GetSourceFieldItem: {
                operationId: 'getSourceFieldItem',
                parameters: { id: '$response.body#/id' },
                description:
                  'The `id` value returned in the response can be used as the `id` parameter in `GET /source_fields/{id}`.',
              },
            },
          },
          '400': { description: 'Invalid input' },
          '422': { description: 'Unprocessable entity' },
          '404': { description: 'Resource not found' },
        },
        summary: 'Updates the SourceField resource.',
        description: 'Updates the SourceField resource.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Resource identifier',
            required: true,
            deprecated: false,
            allowEmptyValue: false,
            schema: { type: 'string' },
            style: 'simple',
            explode: false,
            allowReserved: false,
          },
        ],
        requestBody: {
          description: 'The updated SourceField resource',
          content: {
            'application/merge-patch+json': {
              schema: {
                $ref: '#/components/schemas/SourceField-source_field.api',
              },
            },
          },
          required: true,
        },
        deprecated: false,
      },
      parameters: [],
    },
  },
  components: {
    schemas: {
      AttributeInterface: {
        type: 'object',
        properties: {
          attributeCode: { readOnly: true, type: 'string' },
          value: { readOnly: true },
        },
      },
      'AttributeInterface.jsonld': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          attributeCode: { readOnly: true, type: 'string' },
          value: { readOnly: true },
        },
      },
      Catalog: {
        type: 'object',
        properties: {
          id: { readOnly: true, type: 'integer' },
          code: { type: 'string' },
          name: { type: 'string', nullable: true },
          localizedCatalogs: {
            type: 'array',
            items: { type: 'string', format: 'iri-reference' },
          },
        },
        required: ['code'],
      },
      'Catalog.jsonld': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          id: { readOnly: true, type: 'integer' },
          code: { type: 'string' },
          name: { type: 'string', nullable: true },
          localizedCatalogs: {
            type: 'array',
            items: { type: 'string', format: 'iri-reference' },
          },
        },
        required: ['code'],
      },
      Category: {
        type: 'object',
        properties: {
          id: { readOnly: true, type: 'integer' },
          name: { type: 'string' },
        },
      },
      'Category.jsonld': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          id: { readOnly: true, type: 'integer' },
          name: { type: 'string' },
        },
      },
      DeclarativeGreeting: {
        type: 'object',
        description: 'Description of declarative greetings (description)',
        externalDocs: { url: 'Declarative Greeting' },
        properties: {
          id: {
            readOnly: true,
            description: 'The entity ID.',
            type: 'integer',
          },
          name: { description: 'A nice person.', type: 'string' },
        },
        required: ['name'],
      },
      'DeclarativeGreeting.jsonld': {
        type: 'object',
        description: 'Description of declarative greetings (description)',
        externalDocs: { url: 'Declarative Greeting' },
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          id: {
            readOnly: true,
            description: 'The entity ID.',
            type: 'integer',
          },
          name: { description: 'A nice person.', type: 'string' },
        },
        required: ['name'],
      },
      Document: {
        type: 'object',
        properties: {
          indexName: { type: 'string' },
          documents: { type: 'array', items: { type: 'string' } },
        },
      },
      'Document.jsonld': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          indexName: { type: 'string' },
          documents: { type: 'array', items: { type: 'string' } },
        },
      },
      ExampleCategory: {
        type: 'object',
        properties: {
          id: { readOnly: true, type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
        },
      },
      'ExampleCategory.jsonld': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          id: { readOnly: true, type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
        },
      },
      ExampleDocument: {
        type: 'object',
        properties: {
          indexName: { type: 'string' },
          documents: { type: 'array', items: { type: 'string' } },
        },
      },
      'ExampleDocument.jsonld': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          indexName: { type: 'string' },
          documents: { type: 'array', items: { type: 'string' } },
        },
      },
      ExampleIndex: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          health: { description: 'health', type: 'string' },
        },
      },
      'ExampleIndex.jsonld': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          name: { type: 'string' },
          health: { description: 'health', type: 'string' },
        },
      },
      ExampleProduct: {
        type: 'object',
        properties: {
          entity_id: { type: 'string' },
          description: {
            example: 'description',
            description: 'description',
            type: 'array',
            items: { type: 'string' },
          },
          type_id: { type: 'string' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' },
          attributes: {
            type: 'array',
            items: { $ref: '#/components/schemas/AttributeInterface' },
          },
        },
      },
      'ExampleProduct.jsonld': {
        type: 'object',
        properties: {
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          entity_id: { type: 'string' },
          description: {
            example: 'description',
            description: 'description',
            type: 'array',
            items: { type: 'string' },
          },
          type_id: { type: 'string' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' },
          attributes: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/AttributeInterface.jsonld',
            },
          },
        },
      },
      'FacetConfiguration-facet_configuration.read': {
        type: 'object',
        properties: {
          id: { readOnly: true, type: 'string' },
          sourceField: { type: 'string', format: 'iri-reference' },
          category: {
            type: 'string',
            format: 'iri-reference',
            nullable: true,
          },
          displayMode: { type: 'string', nullable: true },
          coverageRate: { type: 'integer', nullable: true },
          maxSize: { type: 'integer', nullable: true },
          sortOrder: { type: 'string', nullable: true },
          isRecommendable: { type: 'boolean', nullable: true },
          isVirtual: { type: 'boolean', nullable: true },
          defaultDisplayMode: {
            readOnly: true,
            type: 'string',
            nullable: true,
          },
          defaultCoverageRate: {
            readOnly: true,
            type: 'integer',
            nullable: true,
          },
          defaultMaxSize: {
            readOnly: true,
            type: 'integer',
            nullable: true,
          },
          defaultSortOrder: {
            readOnly: true,
            type: 'string',
            nullable: true,
          },
          defaultIsRecommendable: {
            readOnly: true,
            type: 'boolean',
            nullable: true,
          },
          defaultIsVirtual: {
            readOnly: true,
            type: 'boolean',
            nullable: true,
          },
        },
        required: ['sourceField'],
      },
      'FacetConfiguration-facet_configuration.write': {
        type: 'object',
        properties: {
          displayMode: { type: 'string', nullable: true },
          coverageRate: { type: 'integer', nullable: true },
          maxSize: { type: 'integer', nullable: true },
          sortOrder: { type: 'string', nullable: true },
          isRecommendable: { type: 'boolean', nullable: true },
          isVirtual: { type: 'boolean', nullable: true },
        },
      },
      'FacetConfiguration.jsonld-facet_configuration.read': {
        type: 'object',
        properties: {
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          id: { readOnly: true, type: 'string' },
          sourceField: { type: 'string', format: 'iri-reference' },
          category: {
            type: 'string',
            format: 'iri-reference',
            nullable: true,
          },
          displayMode: { type: 'string', nullable: true },
          coverageRate: { type: 'integer', nullable: true },
          maxSize: { type: 'integer', nullable: true },
          sortOrder: { type: 'string', nullable: true },
          isRecommendable: { type: 'boolean', nullable: true },
          isVirtual: { type: 'boolean', nullable: true },
          defaultDisplayMode: {
            readOnly: true,
            type: 'string',
            nullable: true,
          },
          defaultCoverageRate: {
            readOnly: true,
            type: 'integer',
            nullable: true,
          },
          defaultMaxSize: {
            readOnly: true,
            type: 'integer',
            nullable: true,
          },
          defaultSortOrder: {
            readOnly: true,
            type: 'string',
            nullable: true,
          },
          defaultIsRecommendable: {
            readOnly: true,
            type: 'boolean',
            nullable: true,
          },
          defaultIsVirtual: {
            readOnly: true,
            type: 'boolean',
            nullable: true,
          },
        },
        required: ['sourceField'],
      },
      'FacetConfiguration.jsonld-facet_configuration.write': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          displayMode: { type: 'string', nullable: true },
          coverageRate: { type: 'integer', nullable: true },
          maxSize: { type: 'integer', nullable: true },
          sortOrder: { type: 'string', nullable: true },
          isRecommendable: { type: 'boolean', nullable: true },
          isVirtual: { type: 'boolean', nullable: true },
        },
      },
      'Index-create': {
        type: 'object',
        properties: {
          name: { type: 'string' },
          aliases: { type: 'array', items: { type: 'string' } },
        },
      },
      'Index-details': {
        type: 'object',
        properties: {
          name: { type: 'string' },
          aliases: { type: 'array', items: { type: 'string' } },
          docsCount: { type: 'integer' },
          size: { type: 'string' },
          entityType: { type: 'string', nullable: true },
          catalog: {
            type: 'string',
            format: 'iri-reference',
            nullable: true,
          },
          status: { type: 'string' },
          mapping: { type: 'array', items: { type: 'string' } },
          settings: { type: 'array', items: { type: 'string' } },
        },
      },
      'Index-list': {
        type: 'object',
        properties: {
          name: { type: 'string' },
          aliases: { type: 'array', items: { type: 'string' } },
          docsCount: { type: 'integer' },
          size: { type: 'string' },
          entityType: { type: 'string', nullable: true },
          catalog: {
            type: 'string',
            format: 'iri-reference',
            nullable: true,
          },
          status: { type: 'string' },
        },
      },
      'Index.CreateIndexInput-create': {
        type: 'object',
        required: ['entityType', 'catalog'],
        properties: {
          entityType: { type: 'string' },
          catalog: { type: 'integer' },
        },
      },
      'Index.CreateIndexInput.jsonld-create': {
        type: 'object',
        required: ['entityType', 'catalog'],
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          entityType: { type: 'string' },
          catalog: { type: 'integer' },
        },
      },
      'Index.InstallIndexInput-list': { type: 'object' },
      'Index.InstallIndexInput.jsonld-list': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
        },
      },
      'Index.RefreshIndexInput-list': { type: 'object' },
      'Index.RefreshIndexInput.jsonld-list': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
        },
      },
      'Index.jsonld-create': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          name: { type: 'string' },
          aliases: { type: 'array', items: { type: 'string' } },
        },
      },
      'Index.jsonld-details': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          name: { type: 'string' },
          aliases: { type: 'array', items: { type: 'string' } },
          docsCount: { type: 'integer' },
          size: { type: 'string' },
          entityType: { type: 'string', nullable: true },
          catalog: {
            type: 'string',
            format: 'iri-reference',
            nullable: true,
          },
          status: { type: 'string' },
          mapping: { type: 'array', items: { type: 'string' } },
          settings: { type: 'array', items: { type: 'string' } },
        },
      },
      'Index.jsonld-list': {
        type: 'object',
        properties: {
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          name: { type: 'string' },
          aliases: { type: 'array', items: { type: 'string' } },
          docsCount: { type: 'integer' },
          size: { type: 'string' },
          entityType: { type: 'string', nullable: true },
          catalog: {
            type: 'string',
            format: 'iri-reference',
            nullable: true,
          },
          status: { type: 'string' },
        },
      },
      LocalizedCatalog: {
        type: 'object',
        properties: {
          id: { readOnly: true, type: 'integer' },
          name: { type: 'string', nullable: true },
          code: { type: 'string' },
          locale: {
            pattern: '^(.*[a-z]{2}_[A-Z]{2})$',
            minLength: 5,
            maxLength: 5,
            type: 'string',
          },
          isDefault: { type: 'boolean' },
          catalog: { type: 'string', format: 'iri-reference' },
          default: { readOnly: true, type: 'boolean' },
        },
        required: ['code', 'locale', 'catalog'],
      },
      'LocalizedCatalog.jsonld': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          id: { readOnly: true, type: 'integer' },
          name: { type: 'string', nullable: true },
          code: { type: 'string' },
          locale: {
            pattern: '^(.*[a-z]{2}_[A-Z]{2})$',
            minLength: 5,
            maxLength: 5,
            type: 'string',
          },
          isDefault: { type: 'boolean' },
          catalog: { type: 'string', format: 'iri-reference' },
          default: { readOnly: true, type: 'boolean' },
        },
        required: ['code', 'locale', 'catalog'],
      },
      MappingStatus: {
        type: 'object',
        properties: {
          entityType: { type: 'string' },
          status: { type: 'string' },
        },
      },
      'MappingStatus.jsonld': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          entityType: { type: 'string' },
          status: { type: 'string' },
        },
      },
      Menu: {
        type: 'object',
        properties: {
          code: {
            readOnly: true,
            default: 'menu',
            example: 'menu',
            type: 'string',
          },
          hierarchy: {
            readOnly: true,
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      'Menu.jsonld': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          code: {
            readOnly: true,
            default: 'menu',
            example: 'menu',
            type: 'string',
          },
          hierarchy: {
            readOnly: true,
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      Metadata: {
        type: 'object',
        properties: {
          id: { readOnly: true, type: 'integer' },
          entity: { type: 'string' },
          sourceFields: {
            type: 'array',
            items: { type: 'string', format: 'iri-reference' },
          },
        },
        required: ['entity'],
      },
      'Metadata.jsonld': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          id: { readOnly: true, type: 'integer' },
          entity: { type: 'string' },
          sourceFields: {
            type: 'array',
            items: { type: 'string', format: 'iri-reference' },
          },
        },
        required: ['entity'],
      },
      'SourceField-source_field.api': {
        type: 'object',
        properties: {
          id: { readOnly: true, type: 'integer' },
          code: { type: 'string' },
          defaultLabel: { type: 'string', nullable: true },
          type: { type: 'string', nullable: true },
          weight: { type: 'integer', nullable: true },
          isSearchable: { type: 'boolean', nullable: true },
          isFilterable: { type: 'boolean', nullable: true },
          isSortable: { type: 'boolean', nullable: true },
          isSpellchecked: { type: 'boolean', nullable: true },
          isUsedForRules: { type: 'boolean', nullable: true },
          metadata: { type: 'string', format: 'iri-reference' },
          labels: {
            type: 'array',
            items: { type: 'string', format: 'iri-reference' },
          },
          options: {
            type: 'array',
            items: { type: 'string', format: 'iri-reference' },
          },
          searchable: {
            readOnly: true,
            type: 'boolean',
            nullable: true,
          },
          filterable: {
            readOnly: true,
            type: 'boolean',
            nullable: true,
          },
          sortable: { readOnly: true, type: 'boolean', nullable: true },
          spellchecked: {
            readOnly: true,
            type: 'boolean',
            nullable: true,
          },
          usedForRules: {
            readOnly: true,
            type: 'boolean',
            nullable: true,
          },
          system: { readOnly: true, type: 'boolean' },
        },
        required: ['code', 'metadata'],
      },
      'SourceField.jsonld-source_field.api': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          id: { readOnly: true, type: 'integer' },
          code: { type: 'string' },
          defaultLabel: { type: 'string', nullable: true },
          type: { type: 'string', nullable: true },
          weight: { type: 'integer', nullable: true },
          isSearchable: { type: 'boolean', nullable: true },
          isFilterable: { type: 'boolean', nullable: true },
          isSortable: { type: 'boolean', nullable: true },
          isSpellchecked: { type: 'boolean', nullable: true },
          isUsedForRules: { type: 'boolean', nullable: true },
          metadata: { type: 'string', format: 'iri-reference' },
          labels: {
            type: 'array',
            items: { type: 'string', format: 'iri-reference' },
          },
          options: {
            type: 'array',
            items: { type: 'string', format: 'iri-reference' },
          },
          searchable: {
            readOnly: true,
            type: 'boolean',
            nullable: true,
          },
          filterable: {
            readOnly: true,
            type: 'boolean',
            nullable: true,
          },
          sortable: { readOnly: true, type: 'boolean', nullable: true },
          spellchecked: {
            readOnly: true,
            type: 'boolean',
            nullable: true,
          },
          usedForRules: {
            readOnly: true,
            type: 'boolean',
            nullable: true,
          },
          system: { readOnly: true, type: 'boolean' },
        },
        required: ['code', 'metadata'],
      },
      SourceFieldLabel: {
        type: 'object',
        properties: {
          id: { readOnly: true, type: 'integer' },
          sourceField: { type: 'string', format: 'iri-reference' },
          catalog: { type: 'string', format: 'iri-reference' },
          label: { type: 'string' },
        },
        required: ['sourceField', 'catalog', 'label'],
      },
      'SourceFieldLabel.jsonld': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          id: { readOnly: true, type: 'integer' },
          sourceField: { type: 'string', format: 'iri-reference' },
          catalog: { type: 'string', format: 'iri-reference' },
          label: { type: 'string' },
        },
        required: ['sourceField', 'catalog', 'label'],
      },
      SourceFieldOption: {
        type: 'object',
        properties: {
          id: { readOnly: true, type: 'integer' },
          sourceField: { type: 'string', format: 'iri-reference' },
          position: { type: 'integer', nullable: true },
          labels: {
            type: 'array',
            items: { type: 'string', format: 'iri-reference' },
          },
        },
        required: ['sourceField'],
      },
      'SourceFieldOption.jsonld': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          id: { readOnly: true, type: 'integer' },
          sourceField: { type: 'string', format: 'iri-reference' },
          position: { type: 'integer', nullable: true },
          labels: {
            type: 'array',
            items: { type: 'string', format: 'iri-reference' },
          },
        },
        required: ['sourceField'],
      },
      SourceFieldOptionLabel: {
        type: 'object',
        properties: {
          id: { readOnly: true, type: 'integer' },
          sourceFieldOption: { type: 'string', format: 'iri-reference' },
          catalog: { type: 'string', format: 'iri-reference' },
          label: { type: 'string' },
        },
        required: ['sourceFieldOption', 'catalog', 'label'],
      },
      'SourceFieldOptionLabel.jsonld': {
        type: 'object',
        properties: {
          '@context': {
            readOnly: true,
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  '@vocab': { type: 'string' },
                  hydra: {
                    type: 'string',
                    enum: ['http://www.w3.org/ns/hydra/core#'],
                  },
                },
                required: ['@vocab', 'hydra'],
                additionalProperties: true,
              },
            ],
          },
          '@id': { readOnly: true, type: 'string' },
          '@type': { readOnly: true, type: 'string' },
          id: { readOnly: true, type: 'integer' },
          sourceFieldOption: { type: 'string', format: 'iri-reference' },
          catalog: { type: 'string', format: 'iri-reference' },
          label: { type: 'string' },
        },
        required: ['sourceFieldOption', 'catalog', 'label'],
      },
      Token: {
        type: 'object',
        properties: { token: { type: 'string', readOnly: true } },
      },
      Credentials: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'admin@example.com' },
          password: { type: 'string', example: 'apassword' },
        },
      },
    },
    responses: {},
    parameters: {},
    examples: {},
    requestBodies: {},
    headers: {},
    securitySchemes: {
      apiKey: {
        type: 'apiKey',
        description: 'Value for the Authorization header parameter.',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
  security: [{ apiKey: [] }],
  tags: [],
} as IDocsJson
