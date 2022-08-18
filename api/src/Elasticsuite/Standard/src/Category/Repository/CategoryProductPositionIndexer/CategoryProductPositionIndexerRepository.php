<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
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

    private function reindexDocuments(array $products, array $response, string $indexAlias)
    {
        $documentUpdated = false;
        foreach ($response['hits']['hits'] as $document) {
            $productId = $document['_source']['id'] ?? null;
            if (null === $productId) {
                continue;
            }

            // If the category node does not exist in the document we don't set the position to avoid data inconsistency.
            $categories = $document['_source']['category'] ?? [];
            if (!empty($categories)) {
                $origCategories = $categories;
                foreach ($categories as &$category) {
                    if (isset($category['id'])
                        && isset($products[$productId][$category['id']])) {
                        $productData = $products[$productId][$category['id']];
                        $category['position'] = $productData['position'];
                        if (null === $productData['position']) { // if the position is null, that means the position has been deleted.
                            unset($category['position']);
                        }
                    }
                }

                if ($origCategories != $categories) {
                    $documentUpdated = true;
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
        }

        if ($documentUpdated) {
            $this->indexRepository->refresh($indexAlias);
        }
    }
}
