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
            score: Number(document.score),
            image: document.source?.image as string,
            stock: document.source?.stock ?? undefined,
            price: document.source?.price ?? [],
          })) ?? [],
      },
    },
  }
}
