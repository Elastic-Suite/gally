<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Category\Repository\CategoryProductPositionIndexer;

use Elasticsearch\Client;
use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Category\Model\Category\ProductMerchandising;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;
use Elasticsuite\Index\Service\IndexSettings;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Search\Model\Document;
use Psr\Log\LoggerInterface;

class CategoryProductPositionIndexerRepository implements CategoryProductPositionIndexerRepositoryInterface
{
    private const BATCH_SIZE = 50;

    public function __construct(
        private Client $client,
        private MetadataRepository $metadataRepository,
        private IndexSettings $indexSettings,
        private IndexRepositoryInterface $indexRepository,
        private LoggerInterface $logger,
    ) {
    }

    /**
     * {@inheritDoc}
     */
    public function reindex(ProductMerchandising $productMerchandising, array $localizedCatalogs): void
    {
        foreach ($localizedCatalogs as $localizedCatalog) {
            $this->reindexByProducts(
                [
                    $productMerchandising->getProductId() => [
                        $productMerchandising->getCategory()->getId() => [
                            'position' => $productMerchandising->getPosition(),
                        ],
                    ],
                ],
                $localizedCatalog
            );
        }
    }

    /**
     * $products format:
     * [
     *    '15 (product_id)' => [
     *        '1 (category_id)' => [
     *            'position'    => 10,
     *        ],
     *        '2 (category_id)' => [
     *            'position'    => 5,
     *        ]
     *    ],
     *    '17 (product_id)' => [
     *        '15 (category_id)' => [
     *            'position'    => 1,
     *        ],
     *        ...
     *    ],
     *    ...
     * ].
     *
     * {@inheritDoc}
     */
    public function reindexByProducts(array $products, LocalizedCatalog $localizedCatalog): void
    {
        $metadata = $this->metadataRepository->findOneBy(['entity' => 'product']);
        // Can be empty  during the execution of the fixtures.
        if (!$metadata) {
            return;
        }
        $indexAlias = $this->indexSettings->getIndexAliasFromIdentifier($metadata->getEntity(), $localizedCatalog);

        // Can be possible during the execution of the fixtures.
        if (!$this->client->indices()->exists(['index' => $indexAlias])) {
            $this->logger->error(sprintf("The indexation of product positions is not possible because the index '%s' does not exist.", $indexAlias));

            return;
        }

        foreach (array_chunk($products, self::BATCH_SIZE, true) as $productsChunk) {
            $response = $this->client->search(
                [
                    'index' => $indexAlias,
                    'from' => 0,
                    'size' => self::BATCH_SIZE,
                    '_source' => ['id', 'category'],
                    'body' => [
                        'query' => ['bool' => ['should' => ['terms' => ['id' => array_keys($productsChunk)]]]],
                    ],
                ],
            );

            if (isset($response['hits']['hits']) && \count($response['hits']['hits']) > 0) {
                $this->reindexDocuments($productsChunk, $response, $indexAlias);
            }
        }
    }

    protected function reindexDocuments(array $products, array $response, string $indexAlias)
    {
        $documentUpdated = false;
        foreach ($response['hits']['hits'] as $document) {
            $productId = $document['_source']['id'] ?? null;
            if (null === $productId) {
                continue;
            }

            $categories = $document['_source']['category'] ?? [];
            $origCategories = $categories;
            $categories = $this->getCategoriesWithUpdatedData($categories, $products[$productId]);

            if ($origCategories != $categories) {
                $documentUpdated = true;
                $this->updateDocument($document, $indexAlias, $categories);
            }
        }

        if ($documentUpdated) {
            $this->indexRepository->refresh($indexAlias);
        }
    }

    /**
     * Add/update position data in $productCategories.
     */
    protected function getCategoriesWithUpdatedData(array $productCategories, array $newPositionsByCategory): array
    {
        foreach ($newPositionsByCategory as $categoryId => $newPositionByCategory) {
            $key = array_search($categoryId, array_column($productCategories, 'id'), true);
            if (false !== $key) {
                $productCategories[$key]['id'] = $categoryId;
                $productCategories[$key]['position'] = $newPositionByCategory['position'];
                // if the position is null, that means the position has been deleted.
                if (null === $newPositionByCategory['position']) {
                    unset($productCategories[$key]['position']);
                }
            }
        }

        return $productCategories;
    }

    /**
     * Performs a query to update the document in ElasticSearch.
     */
    protected function updateDocument(array $document, string $indexAlias, array $categories): void
    {
        $params = [
            'id' => $document['_id'],
            'index' => $indexAlias,
            'body' => [
                'doc' => [
                    'category' => $categories,
                ],
            ],
        ];

        $result = $this->client->update($params);
        if (!isset($result['_shards']['failed']) || $result['_shards']['failed'] > 0) {
            $this->logger->error(
                'Error during position update',
                [
                    'params' => $params,
                    'result' => $result,
                ]
            );
        }
    }
}
