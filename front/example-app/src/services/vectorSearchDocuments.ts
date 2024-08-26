import {
  IFetch,
  IGraphqlSearchProducts,
  IGraphqlVectorSearchDocuments,
} from '@elastic-suite/gally-admin-shared'

export function transformVectorSearchDocumentsIntoProducts(
  fetchedVectorSearchDocuments: IFetch<IGraphqlVectorSearchDocuments>
): IFetch<IGraphqlSearchProducts> {
  const fetchedVectorSearchDocumentsData =
    fetchedVectorSearchDocuments?.data?.vectorSearchDocuments
  return {
    ...fetchedVectorSearchDocuments,
    data: {
      products: {
        ...fetchedVectorSearchDocumentsData,
        collection:
          fetchedVectorSearchDocumentsData?.collection?.map((document) => ({
            id: document.id,
            sku: document.source?.sku as string,
            name:
              Array.isArray(document.source?.name) &&
              document.source.name.length > 0
                ? (document.source?.name[0] as string)
                : '',
            description:
              Array.isArray(document.source?.description) &&
              document.source.description.length > 0
                ? (document.source?.description[0] as string)
                : '',
            score: Number(document.score),
            image: document.source?.image as string,
            stock: document.source?.stock ?? undefined,
            price: document.source?.price ?? [],
            uri: document.source?.uri as string,
            file_type: document.source?.file_type as string,
            document_type: document.source?.document_type as string,
            publication_type: document.source?.publication_type as string,
            author: document.source?.author ?? [],
            content: document.source?.content as string,
            workspace: document.source?.workspace as string,
            year: document.source?.updated_at as string,
            updated_at: document.source?.updated_at as string,
          })) ?? [],
      },
    },
  }
}
