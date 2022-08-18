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

namespace Elasticsuite\Category\Tests\Api;

trait CategoryTestTrait
{
    /**
     * Check if the position data in $expectedPositions are equal to the position data in Elasticsearch.
     */
    public function checkPositionDataFromEs(array $expectedPositions, string $indexName = null): void
    {
        foreach ($expectedPositions as $localizedCatalogId => $productData) {
            $indexAlias = $indexName;
            if (null === $indexName) {
                $indexAlias = self::$indexSettings->getIndexAliasFromIdentifier('product', $localizedCatalogId);
            }
            $response = self::$client->search(
                [
                    'index' => $indexAlias,
                    'from' => 0,
                    'size' => \count($productData),
                    '_source' => ['id', 'category'],
                    'body' => [
                        'query' => ['bool' => ['should' => ['terms' => ['id' => array_keys($productData)]]]],
                    ],
                ],
            );

            $this->assertArraySubset(['hits' => ['hits' => []]], $response);
            $this->assertCount(\count($productData), $response['hits']['hits']);

            $productDataFromEs = [];

            foreach ($response['hits']['hits'] as $document) {
                $productId = $document['_source']['id'] ?? null;
                $categories = $document['_source']['category'] ?? [];
                $productDataFromEs[$productId] = [];
                foreach ($categories as $category) {
                    $productDataFromEs[$productId][$category['id']] = [];
                    if (isset($category['position'])) {
                        $productDataFromEs[$productId][$category['id']] = ['position' => $category['position']];
                    }
                }
            }
            $this->assertEquals($productData, $productDataFromEs);
        }
    }
}
