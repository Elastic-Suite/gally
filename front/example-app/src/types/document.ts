import {
  IFetch,
  IGraphqlSearchDocuments,
  IGraphqlVectorSearchDocuments,
} from '@elastic-suite/gally-admin-shared'
import { IEntitiesHook } from './entity'

export interface IDocumentsHook extends IEntitiesHook {
  loadDocuments: (condition: boolean) => void
  documents: IFetch<IGraphqlSearchDocuments>
}

export interface IVectorSearchDocumentsHook extends IEntitiesHook {
  loadVectorSearchDocuments: (condition: boolean) => void
  vectorSearchDocuments: IFetch<IGraphqlVectorSearchDocuments>
}
