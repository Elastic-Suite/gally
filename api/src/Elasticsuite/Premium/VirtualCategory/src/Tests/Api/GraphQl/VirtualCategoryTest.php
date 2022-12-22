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

namespace Elasticsuite\VirtualCategory\Tests\Api\GraphQl;

use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;
use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class VirtualCategoryTest extends AbstractTest
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::loadFixture([
            __DIR__ . '/../../fixtures/virtualCategory/categories.yaml',
            __DIR__ . '/../../fixtures/virtualCategory/catalogs.yaml',
            __DIR__ . '/../../fixtures/virtualCategory/source_field.yaml',
            __DIR__ . '/../../fixtures/virtualCategory/metadata.yaml',
        ]);
        self::createEntityElasticsearchIndices('product');
        self::loadElasticsearchDocumentFixtures([__DIR__ . '/../../fixtures/virtualCategory/product_documents.json']);
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::deleteEntityElasticsearchIndices('product');
    }

    /**
     * @dataProvider filteredSearchDocumentsProvider
     *
     * @param string $catalogId             Catalog ID or code
     * @param string $filter                Filters to apply
     * @param array  $sortOrders            Sort order specifications
     * @param string $documentIdentifier    Document identifier to check ordered results
     * @param array  $expectedOrderedDocIds Expected ordered document identifiers
     */
    public function testFilteredSearchProducts(
        string $catalogId,
        array $sortOrders,
        string $filter,
        string $documentIdentifier,
        array $expectedOrderedDocIds
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);
        $arguments = sprintf(
            'requestType: product_catalog, catalogId: "%s", pageSize: %d, currentPage: %d, filter: {%s}',
            $catalogId,
            12,
            1,
            $filter
        );

        $this->addSortOrders($sortOrders, $arguments);

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        products({$arguments}) {
                            collection { id source }
                        }
                    }
                GQL,
                $user
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use (
                    $documentIdentifier,
                    $expectedOrderedDocIds
                ) {
                    // Extra test on response structure because all exceptions might not throw an HTTP error code.
                    $this->assertJsonContains([
                        'data' => [
                            'products' => [
                                'collection' => [],
                            ],
                        ],
                    ]);

                    $responseData = $response->toArray();
                    $this->assertIsArray($responseData['data']['products']['collection']);
                    $this->assertCount(\count($expectedOrderedDocIds), $responseData['data']['products']['collection']);
                    foreach ($responseData['data']['products']['collection'] as $index => $document) {
                        $this->assertArrayHasKey('id', $document);
                        $this->assertEquals("/products/{$expectedOrderedDocIds[$index]}", $document['id']);

                        $this->assertArrayHasKey('source', $document);
                        if (\array_key_exists($documentIdentifier, $document['source'])) {
                            $this->assertEquals($expectedOrderedDocIds[$index], $document['source'][$documentIdentifier]);
                        }
                    }
                }
            )
        );
    }

    public function filteredSearchDocumentsProvider(): array
    {
        return [
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_A"}', // filter.
                'id', // document data identifier.
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_B"}', // filter.
                'id', // document data identifier.
                [3, 4], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_C"}', // filter.
                'id', // document data identifier.
                [5, 6, 7, 8, 9, 10, 11, 12], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_C.1"}', // filter.
                'id', // document data identifier.
                [9, 10], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_C.1.1"}', // filter.
                'id', // document data identifier.
                [11, 12], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_C.1.2"}', // filter.
                'id', // document data identifier.
                [7, 8], // expected ordered document IDs
            ],
            [
                'b2c_en', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_A"}', // filter.
                'id', // document data identifier.
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // expected ordered document IDs
            ],
            [
                'b2c_en', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_B"}', // filter.
                'id', // document data identifier.
                [3, 4], // expected ordered document IDs
            ],
            [
                'b2c_en', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_C"}', // filter.
                'id', // document data identifier.
                [5, 6, 7, 8, 9, 10, 11, 12], // expected ordered document IDs
            ],
            [
                'b2c_en', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_C.1"}', // filter.
                'id', // document data identifier.
                [9, 10, 11, 12], // expected ordered document IDs
            ],
            [
                'b2c_en', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_C.1.1"}', // filter.
                'id', // document data identifier.
                [11, 12], // expected ordered document IDs
            ],
            [
                'b2c_en', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_C.1.2"}', // filter.
                'id', // document data identifier.
                [7, 8], // expected ordered document IDs
            ],
            // The following test data allows to test recursion on virtual categories rules.
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_1"}', // filter.
                'id', // document data identifier.
                [7, 8, 9, 10, 11, 13, 14], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_2"}', // filter.
                'id', // document data identifier.
                [7, 8, 9, 10, 11], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_2.1"}', // filter.
                'id', // document data identifier.
                [9, 10], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_3"}', // filter.
                'id', // document data identifier.
                [13, 14], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_3.1"}', // filter.
                'id', // document data identifier.
                [], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_3.2"}', // filter.
                'id', // document data identifier.
                [], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_4"}', // filter.
                'id', // document data identifier.
                [11, 12], // expected ordered document IDs
            ],
            // Data to check we don't have errors/exception when the virtual rule is related to a category not in the same category tree.
            [
                'b2c_en', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_D"}', // filter.
                'id', // document data identifier.
                [], // expected ordered document IDs
            ],
            // Data to check we don't have errors/exception when the virtual rule is related to a category not in the same catalog.
            [
                'b2b_en', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'category__id: {eq: "cat_D"}', // filter.
                'id', // document data identifier.
                [], // expected ordered document IDs
            ],
        ];
    }

    /**
     * @dataProvider searchProductsWithAggregationsDataProvider
     *
     * @param string      $catalogId       Catalog ID or code
     * @param string|null $currentCategory Current category filter
     */
    public function testSearchProductsWithAggregations(
        string $catalogId,
        ?string $currentCategory,
        array $expectedCategoryIds,
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);
        $arguments = sprintf(
            'requestType: product_catalog, catalogId: "%s", pageSize: %d, currentPage: %d',
            $catalogId,
            12,
            1,
        );

        if ($currentCategory) {
            $arguments .= ', currentCategoryId: "' . $currentCategory . '"';
        }

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        products({$arguments}) {
                            aggregations {
                              field count  type label
                              options {label value count}
                            }
                        }
                    }
                GQL,
                $user
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($expectedCategoryIds) {
                    // Extra test on response structure because all exceptions might not throw an HTTP error code.
                    $this->assertJsonContains(['data' => ['products' => ['aggregations' => []]]]);
                    $responseData = $response->toArray();
                    $this->assertIsArray($responseData['data']['products']['aggregations']);
                    foreach ($responseData['data']['products']['aggregations'] as $aggregation) {
                        if ('category__id' === $aggregation['field']) {
                            $this->assertEquals(
                                $expectedCategoryIds,
                                array_map(fn ($item) => $item['value'], $aggregation['options'])
                            );
                        }
                    }
                }
            )
        );
    }

    public function searchProductsWithAggregationsDataProvider(): array
    {
        return [
            [
                'b2c_fr',   // catalog ID.
                null,       // Current category ID.
                [           // Expected category ids in aggregation
                    'cat_1',
                    'cat_A',
                ],
            ],
            [
                'b2c_fr',   // catalog ID.
                'cat_1',    // Current category ID.
                [           // Expected category ids in aggregation
                    'cat_2',
                    'cat_3',
                    'cat_4',
                ],
            ],
            [
                'b2c_fr',   // catalog ID.
                'cat_A',    // Current category ID.
                [           // Expected category ids in aggregation
                    'cat_B',
                    'cat_C',
                ],
            ],
            [
                'b2c_fr',   // catalog ID.
                'cat_B',    // Current category ID.
                [// Expected category ids in aggregation
                ],
            ],
            [
                'b2c_fr',   // catalog ID.
                'cat_C',    // Current category ID.
                [           // Expected category ids in aggregation
                    'cat_C.1',
                ],
            ],
        ];
    }

    private function addSortOrders(array $sortOrders, string &$arguments): void
    {
        if (!empty($sortOrders)) {
            $sortArguments = [];
            foreach ($sortOrders as $field => $direction) {
                $sortArguments[] = sprintf('%s : %s', $field, $direction);
            }
            $arguments .= sprintf(', sort: {%s}', implode(', ', $sortArguments));
        }
    }
}
