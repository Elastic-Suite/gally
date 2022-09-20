/* eslint-disable prefer-destructuring */
import { IExpandedDocsJsonld, IExpandedEntrypoint } from '../types'

export const expandedEntrypoint = {
  '@id': 'https://localhost/',
  '@type': ['https://localhost/docs.jsonld#Entrypoint'],
  'https://localhost/docs.jsonld#Entrypoint/catalog': [
    { '@id': 'https://localhost/catalogs' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/category': [
    { '@id': 'https://localhost/categories' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/declarativeGreeting': [
    { '@id': 'https://localhost/declarative_greetings' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/exampleCategory': [
    { '@id': 'https://localhost/example_categories' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/exampleDocument': [
    { '@id': 'https://localhost/example_documents' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/exampleIndex': [
    { '@id': 'https://localhost/example_indices' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/exampleProduct': [
    { '@id': 'https://localhost/example_products' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/facetConfiguration': [
    { '@id': 'https://localhost/facet_configurations' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/index': [
    { '@id': 'https://localhost/indices' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/indexDocument': [
    { '@id': 'https://localhost/index_documents' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/localizedCatalog': [
    { '@id': 'https://localhost/localized_catalogs' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/metadata': [
    { '@id': 'https://localhost/metadata' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/sourceField': [
    { '@id': 'https://localhost/source_fields' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/sourceFieldLabel': [
    { '@id': 'https://localhost/source_field_labels' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/sourceFieldOption': [
    { '@id': 'https://localhost/source_field_options' },
  ],
  'https://localhost/docs.jsonld#Entrypoint/sourceFieldOptionLabel': [
    { '@id': 'https://localhost/source_field_option_labels' },
  ],
} as IExpandedEntrypoint

export const expandedDocs = {
  '@id': 'https://localhost/docs.jsonld',
  '@type': ['http://www.w3.org/ns/hydra/core#ApiDocumentation'],
  'http://www.w3.org/ns/hydra/core#entrypoint': [{ '@value': '/' }],
  'http://www.w3.org/ns/hydra/core#supportedClass': [
    {
      '@id': 'https://localhost/docs.jsonld#Index',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves Index resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves Index resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#Index' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the Index resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the Index resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/ReplaceAction',
          ],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#Index' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PUT' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Replaces the Index resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Replaces the Index resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#Index' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/ReplaceAction',
          ],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#Index' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PUT' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Replaces the Index resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Replaces the Index resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#Index' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Index/name',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Index' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'name' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'name' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Index/aliases',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Index' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'aliases' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'aliases' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Index/docsCount',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Index' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#integer' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'docsCount' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'docsCount' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Index/size',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Index' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'size' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'size' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Index/entityType',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Index' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'entityType' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'entityType' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Index/catalog',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Index' },
              ],
              'http://www.w3.org/2002/07/owl#maxCardinality': [{ '@value': 1 }],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'catalog' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'catalog' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Index/status',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Index' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'status' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'status' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'Index' }],
      'http://www.w3.org/2000/01/rdf-schema#label': [{ '@value': 'Index' }],
    },
    {
      '@id': 'https://localhost/docs.jsonld#MappingStatus',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves MappingStatus resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves MappingStatus resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#MappingStatus' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [],
      'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'MappingStatus' }],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'MappingStatus' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#IndexDocument',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves IndexDocument resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves IndexDocument resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#IndexDocument' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the IndexDocument resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the IndexDocument resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#IndexDocument/indexName',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#IndexDocument' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'indexName' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'indexName' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#IndexDocument/documents',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#IndexDocument' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'documents' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'documents' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'IndexDocument' }],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'IndexDocument' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#SourceFieldOption',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves SourceFieldOption resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves SourceFieldOption resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldOption' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/ReplaceAction',
          ],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldOption' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PUT' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Replaces the SourceFieldOption resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Replaces the SourceFieldOption resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldOption' },
          ],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#Operation'],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldOption' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PATCH' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Updates the SourceFieldOption resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Updates the SourceFieldOption resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldOption' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the SourceFieldOption resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the SourceFieldOption resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#SourceFieldOption/sourceField',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceFieldOption' },
              ],
              'http://www.w3.org/2002/07/owl#maxCardinality': [{ '@value': 1 }],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'sourceField' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'sourceField' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceFieldOption/position',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceFieldOption' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#integer' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'position' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'position' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceFieldOption/labels',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceFieldOption' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                {
                  '@id': 'https://localhost/docs.jsonld#SourceFieldOptionLabel',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'labels' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'labels' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [
        { '@value': 'SourceFieldOption' },
      ],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'SourceFieldOption' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#SourceField',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves SourceField resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves SourceField resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#SourceField' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/ReplaceAction',
          ],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#SourceField' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PUT' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Replaces the SourceField resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Replaces the SourceField resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#SourceField' },
          ],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#Operation'],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#SourceField' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PATCH' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Updates the SourceField resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Updates the SourceField resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#SourceField' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the SourceField resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the SourceField resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'https://localhost/docs.jsonld#elasticsuite': [
            {
              'https://localhost/docs.jsonld#editable': [{ '@value': false }],
              'https://localhost/docs.jsonld#position': [{ '@value': 10 }],
              'https://localhost/docs.jsonld#visible': [{ '@value': true }],
            },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceField/code',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'Attribute code' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'code' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'https://localhost/docs.jsonld#elasticsuite': [
            {
              'https://localhost/docs.jsonld#editable': [{ '@value': false }],
              'https://localhost/docs.jsonld#position': [{ '@value': 20 }],
              'https://localhost/docs.jsonld#visible': [{ '@value': true }],
            },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceField/defaultLabel',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'Attribute label' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'defaultLabel' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'https://localhost/docs.jsonld#elasticsuite': [
            {
              'https://localhost/docs.jsonld#context': [
                {
                  'https://localhost/docs.jsonld#grid_2': [
                    {
                      'https://localhost/docs.jsonld#visible': [
                        { '@value': false },
                      ],
                    },
                  ],
                },
              ],
              'https://localhost/docs.jsonld#editable': [{ '@value': false }],
              'https://localhost/docs.jsonld#position': [{ '@value': 30 }],
              'https://localhost/docs.jsonld#visible': [{ '@value': true }],
            },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceField/type',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'Attribute type' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'type' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'https://localhost/docs.jsonld#elasticsuite': [
            {
              'https://localhost/docs.jsonld#context': [
                {
                  'https://localhost/docs.jsonld#grid_2': [
                    {
                      'https://localhost/docs.jsonld#visible': [
                        { '@value': false },
                      ],
                    },
                  ],
                },
              ],
              'https://localhost/docs.jsonld#editable': [{ '@value': true }],
              'https://localhost/docs.jsonld#position': [{ '@value': 40 }],
              'https://localhost/docs.jsonld#visible': [{ '@value': true }],
            },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceField/isFilterable',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#boolean' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'Filterable' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'isFilterable' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'https://localhost/docs.jsonld#elasticsuite': [
            {
              'https://localhost/docs.jsonld#context': [
                {
                  'https://localhost/docs.jsonld#grid_2': [
                    {
                      'https://localhost/docs.jsonld#visible': [
                        { '@value': false },
                      ],
                    },
                  ],
                },
              ],
              'https://localhost/docs.jsonld#editable': [{ '@value': true }],
              'https://localhost/docs.jsonld#position': [{ '@value': 50 }],
              'https://localhost/docs.jsonld#visible': [{ '@value': true }],
            },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceField/isSearchable',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#boolean' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'Searchable' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'isSearchable' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'https://localhost/docs.jsonld#elasticsuite': [
            {
              'https://localhost/docs.jsonld#context': [
                {
                  'https://localhost/docs.jsonld#grid_2': [
                    {
                      'https://localhost/docs.jsonld#visible': [
                        { '@value': false },
                      ],
                    },
                  ],
                },
              ],
              'https://localhost/docs.jsonld#editable': [{ '@value': true }],
              'https://localhost/docs.jsonld#position': [{ '@value': 60 }],
              'https://localhost/docs.jsonld#visible': [{ '@value': true }],
            },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceField/isSortable',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#boolean' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'Sortable' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'isSortable' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'https://localhost/docs.jsonld#elasticsuite': [
            {
              'https://localhost/docs.jsonld#context': [
                {
                  'https://localhost/docs.jsonld#grid_2': [
                    {
                      'https://localhost/docs.jsonld#visible': [
                        { '@value': false },
                      ],
                    },
                  ],
                },
              ],
              'https://localhost/docs.jsonld#editable': [{ '@value': true }],
              'https://localhost/docs.jsonld#position': [{ '@value': 70 }],
              'https://localhost/docs.jsonld#visible': [{ '@value': true }],
            },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceField/isUsedForRules',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#boolean' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'Use in rule engine' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'isUsedForRules' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'https://localhost/docs.jsonld#elasticsuite': [
            {
              'https://localhost/docs.jsonld#context': [
                {
                  'https://localhost/docs.jsonld#grid_2': [
                    {
                      'https://localhost/docs.jsonld#visible': [
                        { '@value': true },
                      ],
                    },
                  ],
                },
              ],
              'https://localhost/docs.jsonld#editable': [{ '@value': true }],
              'https://localhost/docs.jsonld#position': [{ '@value': 80 }],
              'https://localhost/docs.jsonld#visible': [{ '@value': false }],
            },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceField/weight',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#integer' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'Search weight' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'weight' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'https://localhost/docs.jsonld#elasticsuite': [
            {
              'https://localhost/docs.jsonld#context': [
                {
                  'https://localhost/docs.jsonld#grid_2': [
                    {
                      'https://localhost/docs.jsonld#visible': [
                        { '@value': true },
                      ],
                    },
                  ],
                },
              ],
              'https://localhost/docs.jsonld#editable': [{ '@value': true }],
              'https://localhost/docs.jsonld#position': [{ '@value': 90 }],
              'https://localhost/docs.jsonld#visible': [{ '@value': false }],
            },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceField/isSpellchecked',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#boolean' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'Used in spellcheck' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'isSpellchecked' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceField/isSystem',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#boolean' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'isSystem' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'isSystem' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceField/metadata',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2002/07/owl#maxCardinality': [{ '@value': 1 }],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#Metadata' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'metadata' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'metadata' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceField/labels',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#SourceFieldLabel' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'labels' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'labels' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceField/options',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#SourceFieldOption' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'options' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'options' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'SourceField' }],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'SourceField' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#SourceFieldOptionLabel',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves SourceFieldOptionLabel resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves SourceFieldOptionLabel resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldOptionLabel' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/ReplaceAction',
          ],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldOptionLabel' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PUT' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Replaces the SourceFieldOptionLabel resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Replaces the SourceFieldOptionLabel resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldOptionLabel' },
          ],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#Operation'],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldOptionLabel' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PATCH' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Updates the SourceFieldOptionLabel resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Updates the SourceFieldOptionLabel resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldOptionLabel' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the SourceFieldOptionLabel resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the SourceFieldOptionLabel resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#SourceFieldOptionLabel/sourceFieldOption',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id': 'https://localhost/docs.jsonld#SourceFieldOptionLabel',
                },
              ],
              'http://www.w3.org/2002/07/owl#maxCardinality': [{ '@value': 1 }],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#SourceFieldOption' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'sourceFieldOption' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'sourceFieldOption' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#SourceFieldOptionLabel/catalog',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id': 'https://localhost/docs.jsonld#SourceFieldOptionLabel',
                },
              ],
              'http://www.w3.org/2002/07/owl#maxCardinality': [{ '@value': 1 }],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'catalog' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'catalog' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#SourceFieldOptionLabel/label',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id': 'https://localhost/docs.jsonld#SourceFieldOptionLabel',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'label' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'label' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [
        { '@value': 'SourceFieldOptionLabel' },
      ],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'SourceFieldOptionLabel' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#Metadata',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves Metadata resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves Metadata resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#Metadata' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/ReplaceAction',
          ],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#Metadata' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PUT' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Replaces the Metadata resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Replaces the Metadata resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#Metadata' },
          ],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#Operation'],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#Metadata' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PATCH' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Updates the Metadata resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Updates the Metadata resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#Metadata' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the Metadata resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the Metadata resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Metadata/entity',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Metadata' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'entity' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'entity' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Metadata/sourceFields',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Metadata' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'sourceFields' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'sourceFields' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'Metadata' }],
      'http://www.w3.org/2000/01/rdf-schema#label': [{ '@value': 'Metadata' }],
    },
    {
      '@id': 'https://localhost/docs.jsonld#SourceFieldLabel',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves SourceFieldLabel resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves SourceFieldLabel resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldLabel' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/ReplaceAction',
          ],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldLabel' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PUT' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Replaces the SourceFieldLabel resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Replaces the SourceFieldLabel resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldLabel' },
          ],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#Operation'],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldLabel' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PATCH' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Updates the SourceFieldLabel resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Updates the SourceFieldLabel resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#SourceFieldLabel' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the SourceFieldLabel resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the SourceFieldLabel resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#SourceFieldLabel/sourceField',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceFieldLabel' },
              ],
              'http://www.w3.org/2002/07/owl#maxCardinality': [{ '@value': 1 }],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'sourceField' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'sourceField' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceFieldLabel/catalog',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceFieldLabel' },
              ],
              'http://www.w3.org/2002/07/owl#maxCardinality': [{ '@value': 1 }],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'catalog' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'catalog' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#SourceFieldLabel/label',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#SourceFieldLabel' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'label' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'label' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [
        { '@value': 'SourceFieldLabel' },
      ],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'SourceFieldLabel' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#Catalog',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves Catalog resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves Catalog resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#Catalog' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/ReplaceAction',
          ],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#Catalog' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PUT' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Replaces the Catalog resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Replaces the Catalog resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#Catalog' },
          ],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#Operation'],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#Catalog' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PATCH' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Updates the Catalog resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Updates the Catalog resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#Catalog' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the Catalog resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the Catalog resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Catalog/code',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Catalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'code' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'code' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Catalog/name',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Catalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'name' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'name' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Catalog/localizedCatalogs',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Catalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'localizedCatalogs' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'localizedCatalogs' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'Catalog' }],
      'http://www.w3.org/2000/01/rdf-schema#label': [{ '@value': 'Catalog' }],
    },
    {
      '@id': 'https://localhost/docs.jsonld#LocalizedCatalog',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves LocalizedCatalog resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves LocalizedCatalog resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/ReplaceAction',
          ],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PUT' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Replaces the LocalizedCatalog resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Replaces the LocalizedCatalog resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
          ],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#Operation'],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PATCH' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Updates the LocalizedCatalog resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Updates the LocalizedCatalog resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the LocalizedCatalog resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the LocalizedCatalog resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#LocalizedCatalog/name',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'name' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'name' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#LocalizedCatalog/code',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'code' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'code' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#LocalizedCatalog/locale',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'locale' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'locale' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#description': [
            {
              '@value':
                "It's important to keep the getter for isDefault property,\notherwise Api Platform will be not able to get the value in the response,\nin other words don't rename by IsDefault().",
            },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#LocalizedCatalog/isDefault',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#boolean' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'isDefault' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'isDefault' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#LocalizedCatalog/catalog',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
              ],
              'http://www.w3.org/2002/07/owl#maxCardinality': [{ '@value': 1 }],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#Catalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'catalog' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'catalog' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#LocalizedCatalog/localName',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'localName' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'localName' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [
        { '@value': 'LocalizedCatalog' },
      ],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'LocalizedCatalog' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#Authentication',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves Authentication resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves Authentication resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [],
      'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'Authentication' }],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'Authentication' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#Menu',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves Menu resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves Menu resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#Menu' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [],
      'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'Menu' }],
      'http://www.w3.org/2000/01/rdf-schema#label': [{ '@value': 'Menu' }],
    },
    {
      '@id': 'https://localhost/docs.jsonld#FacetConfiguration',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves FacetConfiguration resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves FacetConfiguration resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/ReplaceAction',
          ],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PUT' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Replaces the FacetConfiguration resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Replaces the FacetConfiguration resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
          ],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#Operation'],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PATCH' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Updates the FacetConfiguration resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Updates the FacetConfiguration resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the FacetConfiguration resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the FacetConfiguration resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#FacetConfiguration/sourceField',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
              ],
              'http://www.w3.org/2002/07/owl#maxCardinality': [{ '@value': 1 }],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#SourceField' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'sourceField' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'sourceField' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#FacetConfiguration/category',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
              ],
              'http://www.w3.org/2002/07/owl#maxCardinality': [{ '@value': 1 }],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#Category' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'category' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'category' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#FacetConfiguration/displayMode',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'displayMode' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'displayMode' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#FacetConfiguration/coverageRate',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#integer' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'coverageRate' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'coverageRate' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#FacetConfiguration/maxSize',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#integer' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'maxSize' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'maxSize' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#FacetConfiguration/sortOrder',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'sortOrder' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'sortOrder' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#FacetConfiguration/isRecommendable',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#boolean' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'isRecommendable' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'isRecommendable' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#FacetConfiguration/isVirtual',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#boolean' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'isVirtual' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'isVirtual' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#FacetConfiguration/defaultDisplayMode',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'defaultDisplayMode' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'defaultDisplayMode' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#FacetConfiguration/defaultCoverageRate',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#integer' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'defaultCoverageRate' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'defaultCoverageRate' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#FacetConfiguration/defaultMaxSize',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#integer' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'defaultMaxSize' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'defaultMaxSize' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#FacetConfiguration/defaultSortOrder',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'defaultSortOrder' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'defaultSortOrder' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#FacetConfiguration/defaultIsRecommendable',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#boolean' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'defaultIsRecommendable' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'defaultIsRecommendable' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#FacetConfiguration/defaultIsVirtual',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#FacetConfiguration' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#boolean' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'defaultIsVirtual' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'defaultIsVirtual' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [
        { '@value': 'FacetConfiguration' },
      ],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'FacetConfiguration' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#Document',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves Document resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves Document resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [],
      'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'Document' }],
      'http://www.w3.org/2000/01/rdf-schema#label': [{ '@value': 'Document' }],
    },
    {
      '@id': 'https://localhost/docs.jsonld#Category',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves Category resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves Category resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#Category' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/ReplaceAction',
          ],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#Category' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PUT' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Replaces the Category resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Replaces the Category resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#Category' },
          ],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#Operation'],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#Category' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PATCH' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Updates the Category resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Updates the Category resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#Category' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the Category resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the Category resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Category/id',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Category' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'id' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'id' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Category/parentId',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Category' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'parentId' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'parentId' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Category/level',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Category' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#integer' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'level' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'level' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Category/path',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Category' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'path' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'path' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'Category' }],
      'http://www.w3.org/2000/01/rdf-schema#label': [{ '@value': 'Category' }],
    },
    {
      '@id': 'https://localhost/docs.jsonld#CategorySortingOption',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#CategorySortingOption/label',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id': 'https://localhost/docs.jsonld#CategorySortingOption',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'label' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'label' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#CategorySortingOption/code',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id': 'https://localhost/docs.jsonld#CategorySortingOption',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'code' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'code' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [
        { '@value': 'CategorySortingOption' },
      ],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'CategorySortingOption' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#CategoryConfiguration',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves CategoryConfiguration resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves CategoryConfiguration resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#CategoryConfiguration' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves CategoryConfiguration resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves CategoryConfiguration resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#CategoryConfiguration' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/ReplaceAction',
          ],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#CategoryConfiguration' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PUT' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Replaces the CategoryConfiguration resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Replaces the CategoryConfiguration resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#CategoryConfiguration' },
          ],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#Operation'],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#CategoryConfiguration' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PATCH' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Updates the CategoryConfiguration resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Updates the CategoryConfiguration resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#CategoryConfiguration' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the CategoryConfiguration resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the CategoryConfiguration resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#CategoryConfiguration/category',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id': 'https://localhost/docs.jsonld#CategoryConfiguration',
                },
              ],
              'http://www.w3.org/2002/07/owl#maxCardinality': [{ '@value': 1 }],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#Category' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'category' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'category' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#CategoryConfiguration/catalog',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id': 'https://localhost/docs.jsonld#CategoryConfiguration',
                },
              ],
              'http://www.w3.org/2002/07/owl#maxCardinality': [{ '@value': 1 }],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#Catalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'catalog' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'catalog' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#CategoryConfiguration/localizedCatalog',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id': 'https://localhost/docs.jsonld#CategoryConfiguration',
                },
              ],
              'http://www.w3.org/2002/07/owl#maxCardinality': [{ '@value': 1 }],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'https://localhost/docs.jsonld#LocalizedCatalog' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'localizedCatalog' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'localizedCatalog' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#CategoryConfiguration/name',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id': 'https://localhost/docs.jsonld#CategoryConfiguration',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'name' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'name' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#CategoryConfiguration/isVirtual',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id': 'https://localhost/docs.jsonld#CategoryConfiguration',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#boolean' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'isVirtual' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'isVirtual' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#CategoryConfiguration/useNameInProductSearch',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id': 'https://localhost/docs.jsonld#CategoryConfiguration',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#boolean' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'useNameInProductSearch' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'useNameInProductSearch' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#CategoryConfiguration/defaultSorting',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id': 'https://localhost/docs.jsonld#CategoryConfiguration',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'defaultSorting' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'defaultSorting' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [
        { '@value': 'CategoryConfiguration' },
      ],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'CategoryConfiguration' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#Product',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves Product resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves Product resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [],
      'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'Product' }],
      'http://www.w3.org/2000/01/rdf-schema#label': [{ '@value': 'Product' }],
    },
    {
      '@id': 'https://localhost/docs.jsonld#ExampleDocument',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves ExampleDocument resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves ExampleDocument resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#ExampleDocument' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the ExampleDocument resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the ExampleDocument resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#ExampleDocument/indexName',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#ExampleDocument' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'indexName' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'indexName' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#ExampleDocument/documents',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#ExampleDocument' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'documents' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'documents' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [
        { '@value': 'ExampleDocument' },
      ],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'ExampleDocument' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#ExampleProduct',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves ExampleProduct resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves ExampleProduct resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#ExampleProduct' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#ExampleProduct/entity_id',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#ExampleProduct' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'entity_id' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'entity_id' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#description': [
            { '@value': 'description' },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#ExampleProduct/description',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#ExampleProduct' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'description' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'description' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#ExampleProduct/type_id',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#ExampleProduct' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'type_id' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'type_id' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#ExampleProduct/created_at',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#ExampleProduct' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'created_at' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'created_at' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#ExampleProduct/updated_at',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#ExampleProduct' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'updated_at' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'updated_at' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#ExampleProduct/attributes',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#ExampleProduct' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'attributes' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'attributes' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'ExampleProduct' }],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'ExampleProduct' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#ExampleCategory',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves ExampleCategory resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves ExampleCategory resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#ExampleCategory' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/ReplaceAction',
          ],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#ExampleCategory' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PUT' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Replaces the ExampleCategory resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Replaces the ExampleCategory resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#ExampleCategory' },
          ],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#Operation'],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/docs.jsonld#ExampleCategory' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PATCH' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Updates the ExampleCategory resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Updates the ExampleCategory resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#ExampleCategory' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the ExampleCategory resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the ExampleCategory resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#ExampleCategory/name',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#ExampleCategory' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'name' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'name' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#ExampleCategory/description',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#ExampleCategory' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'description' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'description' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [
        { '@value': 'ExampleCategory' },
      ],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'ExampleCategory' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#ExampleIndex',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves ExampleIndex resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves ExampleIndex resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#ExampleIndex' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the ExampleIndex resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the ExampleIndex resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#ExampleIndex/name',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#ExampleIndex' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'name' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'name' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#description': [
            { '@value': 'health' },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#ExampleIndex/health',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#ExampleIndex' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'health' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': false }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'health' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'ExampleIndex' }],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'ExampleIndex' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#ExampleResultDocument',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves ExampleResultDocument resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves ExampleResultDocument resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [],
      'http://www.w3.org/ns/hydra/core#title': [
        { '@value': 'ExampleResultDocument' },
      ],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'ExampleResultDocument' },
      ],
    },
    {
      '@id': 'https://localhost/Declarative Greeting',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#description': [
        { '@value': 'Description of declarative greetings (description)' },
      ],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/FindAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Retrieves DeclarativeGreeting resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Retrieves DeclarativeGreeting resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/Declarative Greeting' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/DeleteAction',
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'DELETE' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Deletes the DeclarativeGreeting resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Deletes the DeclarativeGreeting resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'http://www.w3.org/2002/07/owl#Nothing' },
          ],
        },
        {
          '@type': [
            'http://www.w3.org/ns/hydra/core#Operation',
            'http://schema.org/ReplaceAction',
          ],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/Declarative Greeting' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PUT' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Replaces the DeclarativeGreeting resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Replaces the DeclarativeGreeting resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/Declarative Greeting' },
          ],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#Operation'],
          'http://www.w3.org/ns/hydra/core#expects': [
            { '@id': 'https://localhost/Declarative Greeting' },
          ],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'PATCH' }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'Updates the DeclarativeGreeting resource.' },
          ],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'Updates the DeclarativeGreeting resource.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/Declarative Greeting' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#description': [
            { '@value': 'A nice person.' },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#DeclarativeGreeting/name',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/Declarative Greeting' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'name' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#required': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'name' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': true }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [
        { '@value': 'DeclarativeGreeting' },
      ],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { '@value': 'DeclarativeGreeting' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#Entrypoint',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedOperation': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#Operation'],
          'http://www.w3.org/ns/hydra/core#method': [{ '@value': 'GET' }],
          'http://www.w3.org/2000/01/rdf-schema#label': [
            { '@value': 'The API entrypoint.' },
          ],
          'http://www.w3.org/ns/hydra/core#returns': [
            { '@id': 'https://localhost/docs.jsonld#EntryPoint' },
          ],
        },
      ],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Entrypoint/index',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value': 'Retrieves the collection of Index resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value': 'Retrieves the collection of Index resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    { '@id': 'https://localhost/docs.jsonld#Index' },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    { '@value': 'Creates a Index resource.' },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    { '@value': 'Creates a Index resource.' },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'https://localhost/docs.jsonld#Index' },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'The collection of Index resources' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        { '@id': 'https://localhost/docs.jsonld#Index' },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of Index resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Entrypoint/indexDocument',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of IndexDocument resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of IndexDocument resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    { '@id': 'https://localhost/docs.jsonld#IndexDocument' },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    { '@value': 'Creates a IndexDocument resource.' },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    { '@value': 'Creates a IndexDocument resource.' },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'https://localhost/docs.jsonld#IndexDocument' },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'The collection of IndexDocument resources' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        {
                          '@id': 'https://localhost/docs.jsonld#IndexDocument',
                        },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of IndexDocument resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#Entrypoint/sourceFieldOption',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of SourceFieldOption resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of SourceFieldOption resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    {
                      '@id': 'https://localhost/docs.jsonld#SourceFieldOption',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    { '@value': 'Creates a SourceFieldOption resource.' },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    { '@value': 'Creates a SourceFieldOption resource.' },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    {
                      '@id': 'https://localhost/docs.jsonld#SourceFieldOption',
                    },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'The collection of SourceFieldOption resources' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        {
                          '@id':
                            'https://localhost/docs.jsonld#SourceFieldOption',
                        },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of SourceFieldOption resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Entrypoint/sourceField',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of SourceField resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of SourceField resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    { '@id': 'https://localhost/docs.jsonld#SourceField' },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    { '@value': 'Creates a SourceField resource.' },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    { '@value': 'Creates a SourceField resource.' },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'https://localhost/docs.jsonld#SourceField' },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'The collection of SourceField resources' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        {
                          '@id': 'https://localhost/docs.jsonld#SourceField',
                        },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of SourceField resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#Entrypoint/sourceFieldOptionLabel',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of SourceFieldOptionLabel resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of SourceFieldOptionLabel resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    {
                      '@id':
                        'https://localhost/docs.jsonld#SourceFieldOptionLabel',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value': 'Creates a SourceFieldOptionLabel resource.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value': 'Creates a SourceFieldOptionLabel resource.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    {
                      '@id':
                        'https://localhost/docs.jsonld#SourceFieldOptionLabel',
                    },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                {
                  '@value':
                    'The collection of SourceFieldOptionLabel resources',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        {
                          '@id':
                            'https://localhost/docs.jsonld#SourceFieldOptionLabel',
                        },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            {
              '@value': 'The collection of SourceFieldOptionLabel resources',
            },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Entrypoint/metadata',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of Metadata resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of Metadata resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    { '@id': 'https://localhost/docs.jsonld#Metadata' },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    { '@value': 'Creates a Metadata resource.' },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    { '@value': 'Creates a Metadata resource.' },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'https://localhost/docs.jsonld#Metadata' },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'The collection of Metadata resources' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        { '@id': 'https://localhost/docs.jsonld#Metadata' },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of Metadata resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#Entrypoint/sourceFieldLabel',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of SourceFieldLabel resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of SourceFieldLabel resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    {
                      '@id': 'https://localhost/docs.jsonld#SourceFieldLabel',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    { '@value': 'Creates a SourceFieldLabel resource.' },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    { '@value': 'Creates a SourceFieldLabel resource.' },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    {
                      '@id': 'https://localhost/docs.jsonld#SourceFieldLabel',
                    },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'The collection of SourceFieldLabel resources' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        {
                          '@id':
                            'https://localhost/docs.jsonld#SourceFieldLabel',
                        },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of SourceFieldLabel resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Entrypoint/catalog',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of Catalog resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of Catalog resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    { '@id': 'https://localhost/docs.jsonld#Catalog' },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    { '@value': 'Creates a Catalog resource.' },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    { '@value': 'Creates a Catalog resource.' },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'https://localhost/docs.jsonld#Catalog' },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'The collection of Catalog resources' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        { '@id': 'https://localhost/docs.jsonld#Catalog' },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of Catalog resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#Entrypoint/localizedCatalog',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of LocalizedCatalog resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of LocalizedCatalog resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    {
                      '@id': 'https://localhost/docs.jsonld#LocalizedCatalog',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    { '@value': 'Creates a LocalizedCatalog resource.' },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    { '@value': 'Creates a LocalizedCatalog resource.' },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    {
                      '@id': 'https://localhost/docs.jsonld#LocalizedCatalog',
                    },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'The collection of LocalizedCatalog resources' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        {
                          '@id':
                            'https://localhost/docs.jsonld#LocalizedCatalog',
                        },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of LocalizedCatalog resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#Entrypoint/facetConfiguration',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of FacetConfiguration resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of FacetConfiguration resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                {
                  '@value': 'The collection of FacetConfiguration resources',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        {
                          '@id':
                            'https://localhost/docs.jsonld#FacetConfiguration',
                        },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of FacetConfiguration resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Entrypoint/category',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of Category resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of Category resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    { '@id': 'https://localhost/docs.jsonld#Category' },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    { '@value': 'Creates a Category resource.' },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    { '@value': 'Creates a Category resource.' },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'https://localhost/docs.jsonld#Category' },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'The collection of Category resources' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        { '@id': 'https://localhost/docs.jsonld#Category' },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of Category resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#Entrypoint/categorySortingOption',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of CategorySortingOption resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of CategorySortingOption resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                {
                  '@value': 'The collection of CategorySortingOption resources',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        {
                          '@id':
                            'https://localhost/docs.jsonld#CategorySortingOption',
                        },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of CategorySortingOption resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#Entrypoint/categoryConfiguration',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of CategoryConfiguration resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of CategoryConfiguration resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    {
                      '@id':
                        'https://localhost/docs.jsonld#CategoryConfiguration',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    { '@value': 'Creates a CategoryConfiguration resource.' },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    { '@value': 'Creates a CategoryConfiguration resource.' },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    {
                      '@id':
                        'https://localhost/docs.jsonld#CategoryConfiguration',
                    },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                {
                  '@value': 'The collection of CategoryConfiguration resources',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        {
                          '@id':
                            'https://localhost/docs.jsonld#CategoryConfiguration',
                        },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of CategoryConfiguration resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Entrypoint/exampleDocument',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of ExampleDocument resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of ExampleDocument resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    {
                      '@id': 'https://localhost/docs.jsonld#ExampleDocument',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    { '@value': 'Creates a ExampleDocument resource.' },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    { '@value': 'Creates a ExampleDocument resource.' },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    {
                      '@id': 'https://localhost/docs.jsonld#ExampleDocument',
                    },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'The collection of ExampleDocument resources' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        {
                          '@id':
                            'https://localhost/docs.jsonld#ExampleDocument',
                        },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of ExampleDocument resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Entrypoint/exampleProduct',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of ExampleProduct resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of ExampleProduct resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'The collection of ExampleProduct resources' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        {
                          '@id': 'https://localhost/docs.jsonld#ExampleProduct',
                        },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of ExampleProduct resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Entrypoint/exampleCategory',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of ExampleCategory resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of ExampleCategory resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    {
                      '@id': 'https://localhost/docs.jsonld#ExampleCategory',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    { '@value': 'Creates a ExampleCategory resource.' },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    { '@value': 'Creates a ExampleCategory resource.' },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    {
                      '@id': 'https://localhost/docs.jsonld#ExampleCategory',
                    },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'The collection of ExampleCategory resources' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        {
                          '@id':
                            'https://localhost/docs.jsonld#ExampleCategory',
                        },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of ExampleCategory resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id': 'https://localhost/docs.jsonld#Entrypoint/exampleIndex',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of ExampleIndex resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of ExampleIndex resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    { '@id': 'https://localhost/docs.jsonld#ExampleIndex' },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    { '@value': 'Creates a ExampleIndex resource.' },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    { '@value': 'Creates a ExampleIndex resource.' },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'https://localhost/docs.jsonld#ExampleIndex' },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'The collection of ExampleIndex resources' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        {
                          '@id': 'https://localhost/docs.jsonld#ExampleIndex',
                        },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of ExampleIndex resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#Entrypoint/declarativeGreeting',
              '@type': ['http://www.w3.org/ns/hydra/core#Link'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                { '@id': 'https://localhost/docs.jsonld#Entrypoint' },
              ],
              'http://www.w3.org/ns/hydra/core#supportedOperation': [
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/FindAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'GET' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    {
                      '@value':
                        'Retrieves the collection of DeclarativeGreeting resources.',
                    },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    {
                      '@value':
                        'Retrieves the collection of DeclarativeGreeting resources.',
                    },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                  ],
                },
                {
                  '@type': [
                    'http://www.w3.org/ns/hydra/core#Operation',
                    'http://schema.org/CreateAction',
                  ],
                  'http://www.w3.org/ns/hydra/core#expects': [
                    { '@id': 'https://localhost/Declarative Greeting' },
                  ],
                  'http://www.w3.org/ns/hydra/core#method': [
                    { '@value': 'POST' },
                  ],
                  'http://www.w3.org/ns/hydra/core#title': [
                    { '@value': 'Creates a DeclarativeGreeting resource.' },
                  ],
                  'http://www.w3.org/2000/01/rdf-schema#label': [
                    { '@value': 'Creates a DeclarativeGreeting resource.' },
                  ],
                  'http://www.w3.org/ns/hydra/core#returns': [
                    { '@id': 'https://localhost/Declarative Greeting' },
                  ],
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                {
                  '@value': 'The collection of DeclarativeGreeting resources',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/ns/hydra/core#Collection' },
                {
                  'http://www.w3.org/2002/07/owl#equivalentClass': [
                    {
                      'http://www.w3.org/2002/07/owl#allValuesFrom': [
                        { '@id': 'https://localhost/Declarative Greeting' },
                      ],
                      'http://www.w3.org/2002/07/owl#onProperty': [
                        { '@id': 'http://www.w3.org/ns/hydra/core#member' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'The collection of DeclarativeGreeting resources' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [
        { '@value': 'The API entrypoint' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#ConstraintViolation',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#description': [
            { '@value': 'The property path of the violation' },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#ConstraintViolation/propertyPath',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id': 'https://localhost/docs.jsonld#ConstraintViolation',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'propertyPath' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [
            { '@value': 'propertyPath' },
          ],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#description': [
            { '@value': 'The message associated with the violation' },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#ConstraintViolation/message',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id': 'https://localhost/docs.jsonld#ConstraintViolation',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                { '@id': 'http://www.w3.org/2001/XMLSchema#string' },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'message' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'message' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [
        { '@value': 'A constraint violation' },
      ],
    },
    {
      '@id': 'https://localhost/docs.jsonld#ConstraintViolationList',
      '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      'http://www.w3.org/ns/hydra/core#supportedProperty': [
        {
          '@type': ['http://www.w3.org/ns/hydra/core#SupportedProperty'],
          'http://www.w3.org/ns/hydra/core#description': [
            { '@value': 'The violations' },
          ],
          'http://www.w3.org/ns/hydra/core#property': [
            {
              '@id':
                'https://localhost/docs.jsonld#ConstraintViolationList/violations',
              '@type': ['http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'],
              'http://www.w3.org/2000/01/rdf-schema#domain': [
                {
                  '@id':
                    'https://localhost/docs.jsonld#ConstraintViolationList',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#range': [
                {
                  '@id': 'https://localhost/docs.jsonld#ConstraintViolation',
                },
              ],
              'http://www.w3.org/2000/01/rdf-schema#label': [
                { '@value': 'violations' },
              ],
            },
          ],
          'http://www.w3.org/ns/hydra/core#readable': [{ '@value': true }],
          'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'violations' }],
          'http://www.w3.org/ns/hydra/core#writeable': [{ '@value': false }],
        },
      ],
      'http://www.w3.org/ns/hydra/core#title': [
        { '@value': 'A constraint violation list' },
      ],
      'http://www.w3.org/2000/01/rdf-schema#subClassOf': [
        { '@id': 'http://www.w3.org/ns/hydra/core#Error' },
      ],
    },
  ],
  'http://www.w3.org/ns/hydra/core#title': [{ '@value': 'Elasticsuite API' }],
} as IExpandedDocsJsonld

export const expandedDocsEntrypoint =
  expandedDocs['http://www.w3.org/ns/hydra/core#supportedClass'][24]

export const expandedProperty =
  expandedDocsEntrypoint[
    'http://www.w3.org/ns/hydra/core#supportedProperty'
  ][5]['http://www.w3.org/ns/hydra/core#property'][0]

export const expandedRange =
  expandedProperty['http://www.w3.org/2000/01/rdf-schema#range']
