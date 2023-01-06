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

namespace Elasticsuite\Product\Tests\Api\GraphQl;

use Elasticsuite\Entity\Service\PriceGroupProvider;
use Elasticsuite\Fixture\Service\ElasticsearchFixturesInterface;
use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;
use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class SearchProductsTest extends AbstractTest
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::loadFixture([
            __DIR__ . '/../../fixtures/facet_configuration.yaml',
            __DIR__ . '/../../fixtures/source_field_option_label.yaml',
            __DIR__ . '/../../fixtures/source_field_option.yaml',
            __DIR__ . '/../../fixtures/source_field_label.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/category_configurations.yaml',
            __DIR__ . '/../../fixtures/categories.yaml',
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
        ]);
        self::createEntityElasticsearchIndices('product');
        self::loadElasticsearchDocumentFixtures([__DIR__ . '/../../fixtures/product_documents.json']);
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::deleteEntityElasticsearchIndices('product');
    }

    /**
     * @dataProvider basicSearchProductsDataProvider
     *
     * @param string  $catalogId            Catalog ID or code
     * @param ?int    $pageSize             Pagination size
     * @param ?int    $currentPage          Current page
     * @param ?array  $expectedError        Expected error
     * @param ?int    $expectedItemsCount   Expected items count in (paged) response
     * @param ?int    $expectedTotalCount   Expected total items count
     * @param ?int    $expectedItemsPerPage Expected pagination items per page
     * @param ?int    $expectedLastPage     Expected number of the last page
     * @param ?string $expectedIndexAlias   Expected index alias
     * @param ?float  $expectedScore        Expected score
     */
    public function testBasicSearchProducts(
        string $catalogId,
        ?int $pageSize,
        ?int $currentPage,
        ?array $expectedError,
        ?int $expectedItemsCount,
        ?int $expectedTotalCount,
        ?int $expectedItemsPerPage,
        ?int $expectedLastPage,
        ?string $expectedIndexAlias,
        ?float $expectedScore
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        $arguments = sprintf(
            'requestType: product_catalog, localizedCatalog: "%s"',
            $catalogId
        );
        if (null !== $pageSize) {
            $arguments .= sprintf(', pageSize: %d', $pageSize);
        }
        if (null !== $currentPage) {
            $arguments .= sprintf(', currentPage: %d', $currentPage);
        }

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        products({$arguments}) {
                            collection {
                              id
                              score
                              index
                            }
                            paginationInfo {
                              itemsPerPage
                              lastPage
                              totalCount
                            }
                        }
                    }
                GQL,
                $user
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use (
                    $expectedError,
                    $expectedItemsCount,
                    $expectedTotalCount,
                    $expectedItemsPerPage,
                    $expectedLastPage,
                    $expectedIndexAlias,
                    $expectedScore
                ) {
                    if (!empty($expectedError)) {
                        $this->assertJsonContains($expectedError);
                        $this->assertJsonContains([
                            'data' => [
                                'products' => null,
                            ],
                        ]);
                    } else {
                        $this->assertJsonContains([
                            'data' => [
                                'products' => [
                                    'paginationInfo' => [
                                        'itemsPerPage' => $expectedItemsPerPage,
                                        'lastPage' => $expectedLastPage,
                                        'totalCount' => $expectedTotalCount,
                                    ],
                                ],
                            ],
                        ]);

                        $responseData = $response->toArray();
                        $this->assertIsArray($responseData['data']['products']['collection']);
                        $this->assertCount($expectedItemsCount, $responseData['data']['products']['collection']);
                        foreach ($responseData['data']['products']['collection'] as $document) {
                            $this->assertArrayHasKey('score', $document);
                            $this->assertEquals($expectedScore, $document['score']);

                            $this->assertArrayHasKey('index', $document);
                            $this->assertStringStartsWith($expectedIndexAlias, $document['index']);
                        }
                    }
                }
            )
        );
    }

    public function basicSearchProductsDataProvider(): array
    {
        return [
            [
                'b2c_uk',   // catalog ID.
                null,   // page size.
                null,   // current page.
                ['errors' => [['message' => 'Internal server error', 'debugMessage' => 'Missing localized catalog [b2c_uk]']]], // expected error.
                null,   // expected items count.
                null,   // expected total count.
                null,   // expected items per page.
                null,   // expected last page.
                null,   // expected index.
                null,   // expected score.
            ],
            [
                '2',    // catalog ID.
                10,     // page size.
                1,      // current page.
                [],     // expected error.
                10,     // expected items count.
                14,     // expected total count.
                10,     // expected items per page.
                2,      // expected last page.
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_b2c_en_product', // expected index alias.
                1.0,    // expected score.
            ],
            [
                'b2c_en',   // catalog ID.
                10,     // page size.
                1,      // current page.
                [],     // expected error.
                10,     // expected items count.
                14,     // expected total count.
                10,     // expected items per page.
                2,      // expected last page.
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_b2c_en_product', // expected index alias.
                1.0,    // expected score.
            ],
            [
                'b2c_en',   // catalog ID.
                10,     // page size.
                2,      // current page.
                [],     // expected error.
                4,      // expected items count.
                14,     // expected total count.
                10,     // expected items per page.
                2,      // expected last page.
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_b2c_en_product', // expected index alias.
                1.0,    // expected score.
            ],
            [
                'b2c_fr',   // catalog ID.
                null,   // page size.
                null,   // current page.
                [],     // expected error.
                12,     // expected items count.
                12,     // expected total count.
                30,     // expected items per page.
                1,      // expected last page.
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_b2c_fr_product', // expected index alias.
                1.0,    // expected score.
            ],
            [
                'b2c_fr',   // catalog ID.
                5,      // page size.
                2,      // current page.
                [],     // expected error.
                5,      // expected items count.
                12,     // expected total count.
                5,      // expected items per page.
                3,      // expected last page.
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_b2c_fr_product', // expected index alias.
                1.0,    // expected score.
            ],
            [
                'b2c_fr',   // catalog ID.
                1000,   // page size.
                null,   // current page.
                [],     // expected error.
                12,     // expected items count.
                12,     // expected total count.
                100,    // expected items per page.
                1,      // expected last page.
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_b2c_fr_product', // expected indexalias.
                1.0,    // expected score.
            ],
        ];
    }

    /**
     * @dataProvider sortedSearchProductsProvider
     *
     * @param string $catalogId             Catalog ID or code
     * @param int    $pageSize              Pagination size
     * @param int    $currentPage           Current page
     * @param array  $sortOrders            Sort order specifications
     * @param string $documentIdentifier    Document identifier to check ordered results
     * @param array  $expectedOrderedDocIds Expected ordered document identifiers
     * @param string $priceGroupId          Price group id
     */
    public function testSortedSearchProducts(
        string $catalogId,
        int $pageSize,
        int $currentPage,
        array $sortOrders,
        string $documentIdentifier,
        array $expectedOrderedDocIds,
        string $priceGroupId = '0',
        ?string $currentCategoryId = null,
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        $arguments = sprintf(
            'requestType: product_catalog, localizedCatalog: "%s", pageSize: %d, currentPage: %d',
            $catalogId,
            $pageSize,
            $currentPage
        );

        if ($currentCategoryId) {
            $arguments .= ", currentCategoryId: \"$currentCategoryId\"";
        }

        if (!empty($sortOrders)) {
            $sortArguments = [];
            foreach ($sortOrders as $field => $direction) {
                $sortArguments[] = sprintf('%s: %s', $field, $direction);
            }
            $arguments .= sprintf(', sort: {%s}', implode(', ', $sortArguments));
        }

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        products({$arguments}) {
                            collection {
                              id
                              score
                              source
                            }
                            paginationInfo {
                              itemsPerPage
                            }
                        }
                    }
                GQL,
                $user,
                [PriceGroupProvider::PRICE_GROUP_ID => $priceGroupId]
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use (
                    $pageSize,
                    $documentIdentifier,
                    $expectedOrderedDocIds
                ) {
                    $this->assertJsonContains([
                        'data' => [
                            'products' => [
                                'paginationInfo' => [
                                    'itemsPerPage' => $pageSize,
                                ],
                            ],
                        ],
                    ]);

                    $responseData = $response->toArray();
                    $this->assertIsArray($responseData['data']['products']['collection']);
                    $this->assertCount(\count($expectedOrderedDocIds), $responseData['data']['products']['collection']);
                    foreach ($responseData['data']['products']['collection'] as $index => $document) {
                        /*
                        $this->assertArrayHasKey('score', $document);
                        $this->assertEquals($expectedScore, $document['score']);
                        */
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

    public function sortedSearchProductsProvider(): array
    {
        return [
            [
                'b2c_en',   // catalog ID.
                10,     // page size.
                1,      // current page.
                [],     // sort order specifications.
                'entity_id', // document data identifier.
                // score DESC first, then id DESC but field 'id' is not present, so missing _first
                // which means the document will be sorted as they were imported.
                // the document.id matched here is the document._id which is entity_id (see fixtures import)
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],    // expected ordered document IDs
            ],
            [
                'b2c_fr',   // catalog ID.
                10,     // page size.
                1,      // current page.
                [],     // sort order specifications.
                'id', // document data identifier.
                // score DESC first, then id DESC which exists in 'b2c_fr'
                // but id DESC w/missing _first, so doc w/entity_id="1" is first
                [1, 12, 11, 10, 9, 8, 7, 6, 5, 4],    // expected ordered document IDs
            ],
            [
                'b2c_fr',   // catalog ID.
                10,     // page size.
                1,      // current page.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'id', // document data identifier.
                // id ASC (missing _last), then score DESC (but not for first doc w/ entity_id="1")
                [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],    // expected ordered document IDs
            ],
            [
                'b2c_fr',   // catalog ID.
                10,     // page size.
                1,      // current page.
                ['size' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'id', // document data identifier.
                // size ASC, then score DESC first, then id DESC (missing _first)
                [10, 5, 11, 2, 4, 3, 6, 9, 7, 1],   // expected ordered document IDs
            ],
            [
                'b2c_fr',   // catalog ID.
                10,     // page size.
                1,      // current page.
                ['size' => SortOrderInterface::SORT_DESC], // sort order specifications.
                'id', // document data identifier.
                // size DESC, then score ASC first, then id ASC (missing _last)
                [8, 12, 1, 7, 9, 6, 3, 4, 2, 11],   // expected ordered document IDs
            ],
            [
                'b2c_fr',   // catalog ID.
                10,     // page size.
                1,      // current page.
                ['created_at' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'id', // document data identifier.
                // size DESC, then score ASC first, then id ASC (missing _last)
                [1, 12, 11, 8, 7, 6, 4, 3, 2, 5],   // expected ordered document IDs
            ],
            [
                'b2c_fr',   // catalog ID.
                5,     // page size.
                1,      // current page.
                ['price_as_nested__price' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'id', // document data identifier.
                // price_as_nested.price ASC, then score DESC first, then id DESC (missing _first)
                [2, 1, 3, 12, 11],   // expected ordered document IDs
            ],
            [
                'b2c_fr',   // catalog ID.
                5,     // page size.
                1,      // current page.
                ['name' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'id', // document data identifier.
                // price_as_nested.price ASC, then score DESC first, then id DESC (missing _first)
                [10, 9, 5, 2, 3],   // expected ordered document IDs
            ],
            [
                'b2c_fr',   // catalog ID.
                5,     // page size.
                1,      // current page.
                ['brand__label' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'id', // document data identifier.
                // price_as_nested.price ASC, then score DESC first, then id DESC (missing _first)
                [1, 12, 11, 10, 9],   // expected ordered document IDs
            ],
            [
                'b2c_fr',   // catalog ID.
                5,     // page size.
                1,      // current page.
                ['my_price__price' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'id', // document data identifier.
                // price_as_nested.price ASC, then score DESC first, then id DESC (missing _first)
                [2, 1, 3, 12, 11],   // expected ordered document IDs
                '0', // Price group id
            ],
            [
                'b2c_fr',   // catalog ID.
                5,     // page size.
                1,      // current page.
                ['my_price__price' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'id', // document data identifier.
                // price_as_nested.price ASC, then score DESC first, then id DESC (missing _first)
                [1, 2, 3, 12, 11],   // expected ordered document IDs
                '1', // Price group id
            ],
            [
                'b2c_fr',   // catalog ID.
                5,     // page size.
                1,      // current page.
                ['my_price__price' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'id', // document data identifier.
                // price_as_nested.price ASC, then score DESC first, then id DESC (missing _first)
                [1, 12, 11, 10, 9],   // expected ordered document IDs
                'fake_price_group_id', // Price group id
            ],
            [
                'b2c_fr',   // catalog ID.
                10,     // page size.
                1,      // current page.
                [],     // sort order specifications.
                'entity_id', // document data identifier.
                // test product are sorted by price because category "cat_1" has price as default sorting option.
                [2, 1],    // expected ordered document IDs
                '0',
                'cat_1',
            ],
        ];
    }

    /**
     * @dataProvider sortInfoSearchProductsProvider
     *
     * @param string $catalogId                  Catalog ID or code
     * @param int    $pageSize                   Pagination size
     * @param int    $currentPage                Current page
     * @param array  $sortOrders                 Sort order specifications
     * @param string $expectedSortOrderField     Expected sort order field
     * @param string $expectedSortOrderDirection Expected sort order direction
     */
    public function testSortInfoSearchProducts(
        string $catalogId,
        int $pageSize,
        int $currentPage,
        array $sortOrders,
        string $expectedSortOrderField,
        string $expectedSortOrderDirection
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        $arguments = sprintf(
            'requestType: product_catalog, localizedCatalog: "%s", pageSize: %d, currentPage: %d',
            $catalogId,
            $pageSize,
            $currentPage
        );

        if (!empty($sortOrders)) {
            $sortArguments = [];
            foreach ($sortOrders as $field => $direction) {
                $sortArguments[] = sprintf('%s: %s', $field, $direction);
            }
            $arguments .= sprintf(', sort: {%s}', implode(', ', $sortArguments));
        }

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        products({$arguments}) {
                            collection {
                              id
                              score
                              source
                            }
                            paginationInfo {
                              itemsPerPage
                            }
                            sortInfo {
                              current {
                                field
                                direction
                              }
                            }
                        }
                    }
                GQL,
                $user
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use (
                    $pageSize,
                    $expectedSortOrderField,
                    $expectedSortOrderDirection
                ) {
                    $this->assertJsonContains([
                        'data' => [
                            'products' => [
                                'paginationInfo' => [
                                    'itemsPerPage' => $pageSize,
                                ],
                                'sortInfo' => [
                                    'current' => [
                                        [
                                            'field' => $expectedSortOrderField,
                                            'direction' => $expectedSortOrderDirection,
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ]);
                }
            )
        );
    }

    public function sortInfoSearchProductsProvider(): array
    {
        return [
            [
                'b2c_en',   // catalog ID.
                10,     // page size.
                1,      // current page.
                [],     // sort order specifications.
                '_score', // expected sort order field.
                SortOrderInterface::SORT_DESC, // expected sort order direction.
            ],
            [
                'b2c_fr',   // catalog ID.
                10,     // page size.
                1,      // current page.
                [],     // sort order specifications.
                '_score', // expected sort order field.
                SortOrderInterface::SORT_DESC, // expected sort order direction.
            ],
            [
                'b2c_fr',   // catalog ID.
                10,     // page size.
                1,      // current page.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'id', // expected sort order field.
                SortOrderInterface::SORT_ASC, // expected sort order direction.
            ],
            [
                'b2c_fr',   // catalog ID.
                10,     // page size.
                1,      // current page.
                ['size' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'size', // expected sort order field.
                SortOrderInterface::SORT_ASC, // expected sort order direction.
            ],
            [
                'b2c_fr',   // catalog ID.
                10,     // page size.
                1,      // current page.
                ['size' => SortOrderInterface::SORT_DESC], // sort order specifications.
                'size', // expected sort order field.
                SortOrderInterface::SORT_DESC, // expected sort order direction.
            ],
            [
                'b2c_fr',   // catalog ID.
                10,     // page size.
                1,      // current page.
                ['created_at' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'created_at', // expected sort order field.
                SortOrderInterface::SORT_ASC, // expected sort order direction.
            ],
            [
                'b2c_fr',   // catalog ID.
                5,     // page size.
                1,      // current page.
                ['price_as_nested__price' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'price_as_nested__price', // expected sort order field.
                SortOrderInterface::SORT_ASC, // expected sort order direction.
            ],
            [
                'b2c_fr',   // catalog ID.
                10,     // page size.
                1,      // current page.
                ['name' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'name', // expected sort order field.
                SortOrderInterface::SORT_ASC, // expected sort order direction.
            ],
            [
                'b2c_fr',   // catalog ID.
                10,     // page size.
                1,      // current page.
                ['brand__label' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'brand__label', // expected sort order field.
                SortOrderInterface::SORT_ASC, // expected sort order direction.
            ],
        ];
    }

    public function testSortedSearchProductsInvalidField(): void
    {
        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        products(requestType: product_catalog, localizedCatalog: "b2c_fr", sort: { length: desc }) {
                            collection { id }
                        }
                    }
                GQL,
                $this->getUser(Role::ROLE_CONTRIBUTOR)
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) {
                    $this->assertJsonContains([
                        'errors' => [['message' => 'Field "length" is not defined by type ProductSortInput.']],
                    ]);
                }
            )
        );

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        products(requestType: product_catalog, localizedCatalog: "b2c_fr", sort: { stock__qty: desc }) {
                            collection { id }
                        }
                    }
                GQL,
                $this->getUser(Role::ROLE_CONTRIBUTOR)
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) {
                    $this->assertJsonContains([
                        'errors' => [['message' => 'Field "stock__qty" is not defined by type ProductSortInput.']],
                    ]);
                }
            )
        );

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        products(requestType: product_catalog, localizedCatalog: "b2c_fr", sort: { price__price: desc }) {
                            collection { id }
                        }
                    }
                GQL,
                $this->getUser(Role::ROLE_CONTRIBUTOR)
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) {
                    $this->assertJsonContains([
                        'errors' => [['message' => 'Field "price__price" is not defined by type ProductSortInput; Did you mean my_price__price?']],
                    ]);
                }
            )
        );

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        products(requestType: product_catalog, localizedCatalog: "b2c_fr", sort: { stock_as_nested__qty: desc }) {
                            collection { id }
                        }
                    }
                GQL,
                $this->getUser(Role::ROLE_CONTRIBUTOR)
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) {
                    $this->assertJsonContains([
                        'errors' => [['message' => 'Field "stock_as_nested__qty" is not defined by type ProductSortInput; Did you mean price_as_nested__price?']],
                    ]);
                }
            )
        );

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        products(requestType: product_catalog, localizedCatalog: "b2c_fr", sort: { id: desc, size: asc }) {
                            collection { id }
                        }
                    }
                GQL,
                $this->getUser(Role::ROLE_CONTRIBUTOR)
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) {
                    $this->assertJsonContains([
                        'errors' => [['debugMessage' => 'Sort argument : You can\'t sort on multiple attribute.']],
                    ]);
                }
            )
        );
    }

    /**
     * @dataProvider fulltextSearchProductsProvider
     *
     * @param string $catalogId             Catalog ID or code
     * @param int    $pageSize              Pagination size
     * @param int    $currentPage           Current page
     * @param string $searchQuery           Search query
     * @param string $documentIdentifier    Document identifier to check ordered results
     * @param array  $expectedOrderedDocIds Expected ordered document identifiers
     */
    public function testFulltextSearchProducts(
        string $catalogId,
        int $pageSize,
        int $currentPage,
        string $searchQuery,
        string $documentIdentifier,
        array $expectedOrderedDocIds
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        $arguments = sprintf(
            'requestType: product_catalog, localizedCatalog: "%s", pageSize: %d, currentPage: %d, search: "%s"',
            $catalogId,
            $pageSize,
            $currentPage,
            $searchQuery,
        );

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        products({$arguments}) {
                            collection { id score source }
                        }
                    }
                GQL,
                $user
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($documentIdentifier, $expectedOrderedDocIds) {
                    $this->validateExpectedResults($response, $documentIdentifier, $expectedOrderedDocIds);
                }
            )
        );
    }

    public function fulltextSearchProductsProvider(): array
    {
        return [
            [
                'b2c_en',   // catalog ID.
                10,         // page size.
                1,          // current page.
                'striveshoulder', // query.
                'id',       // document data identifier.
                [2],        // expected ordered document IDs
            ],
            [
                'b2c_en',   // catalog ID.
                10,         // page size.
                1,          // current page.
                'bag',      // query.
                'id',       // document data identifier.
                [4, 1, 8, 14, 5, 2, 3],  // expected ordered document IDs
            ],
            [
                'b2c_fr',   // catalog ID.
                10,         // page size.
                1,          // current page.
                'bag',      // query.
                'id',       // document data identifier.
                [],  // expected ordered document IDs
            ],
            [
                'b2c_en',   // catalog ID.
                10,         // page size.
                1,          // current page.
                'summer',   // query: search in description field.
                'id',       // document data identifier.
                [5, 3],  // expected ordered document IDs
            ],
            [
                'b2c_en',   // catalog ID.
                10,         // page size.
                1,          // current page.
                'yoga',      // query: search in multiple field.
                'id',       // document data identifier.
                [8, 3],  // expected ordered document IDs
            ],
            [
                'b2c_en',   // catalog ID.
                10,         // page size.
                1,          // current page.
                'bag autumn', // query: search with multiple words.
                'id',       // document data identifier.
                [4],  // expected ordered document IDs
            ],
            [
                'b2c_en',   // catalog ID.
                10,         // page size.
                1,          // current page.
                'bag automn', // query: search with misspelled word.
                'id',       // document data identifier.
                [4],  // expected ordered document IDs
            ],
            [
                'b2c_en',   // catalog ID.
                10,         // page size.
                1,          // current page.
                'bohqpaq',  // query: search with word with same phonetic.
                'id',       // document data identifier.
                [6, 12, 11, 3],  // expected ordered document IDs
            ],
        ];
    }

    /**
     * @dataProvider filteredSearchDocumentsValidationProvider
     *
     * @param string $catalogId    Catalog ID or code
     * @param string $filter       Filters to apply
     * @param array  $debugMessage Expected debug message
     */
    public function testFilteredSearchProductsGraphQlValidation(
        string $catalogId,
        string $filter,
        array $debugMessage
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);
        $arguments = sprintf('requestType: product_catalog, localizedCatalog: "%s", filter: {%s}', $catalogId, $filter);
        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        products({$arguments}) {
                            collection { id }
                        }
                    }
                GQL,
                $user
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use (
                    $debugMessage
                ) {
                    $this->assertJsonContains(['errors' => [$debugMessage]]);
                }
            )
        );
    }

    public function filteredSearchDocumentsValidationProvider(): array
    {
        return [
            [
                'b2c_en', // catalog ID.
                'fake_source_field_match: { match:"sacs" }', // Filters.
                [ // debug message
                    'message' => 'Field "fake_source_field_match" is not defined by type ProductFieldFilterInput.',
                ],
            ],
            [
                'b2c_en', // catalog ID.
                'size: { match: "id" }', // Filters.
                [ // debug message
                    'message' => 'Field "match" is not defined by type EntityIntegerTypeFilterInput.',
                ],
            ],
            [
                'b2c_en', // catalog ID.
                'name: { in: ["Test"], eq: "Test" }', // Filters.
                [ // debug message
                    'debugMessage' => 'Filter argument name: Only \'eq\', \'in\', \'match\' or \'exist\' should be filled.',
                ],
            ],
            [
                'b2c_en', // catalog ID.
                'created_at: { gt: "2022-09-23", gte: "2022-09-23" }', // Filters.
                [ // debug message
                    'debugMessage' => 'Filter argument created_at: Do not use \'gt\' and \'gte\' in the same filter.',
                ],
            ],
            [
                'b2c_en', // catalog ID.
                'is_eco_friendly: {}', // Filters.
                [ // debug message
                    'debugMessage' => 'Filter argument is_eco_friendly: At least \'eq\' or \'exist\' should be filled.',
                ],
            ],
            [
                'b2c_en', // catalog ID.
                'is_eco_friendly: { exist: true, eq: true }', // Filters.
                [ // debug message
                    'debugMessage' => 'Filter argument is_eco_friendly: Only \'eq\' or \'exist\' should be filled.',
                ],
            ],
        ];
    }

    /**
     * @dataProvider filteredSearchDocumentsProvider
     *
     * @param string $catalogId             Catalog ID or code
     * @param string $filter                Filters to apply
     * @param array  $sortOrders            Sort order specifications
     * @param string $documentIdentifier    Document identifier to check ordered results
     * @param array  $expectedOrderedDocIds Expected ordered document identifiers
     * @param string $priceGroupId          Price group id
     */
    public function testFilteredSearchProducts(
        string $catalogId,
        array $sortOrders,
        string $filter,
        string $documentIdentifier,
        array $expectedOrderedDocIds,
        string $priceGroupId = '0'
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);
        $arguments = sprintf(
            'requestType: product_catalog, localizedCatalog: "%s", pageSize: %d, currentPage: %d, filter: {%s}',
            $catalogId,
            10,
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
                $user,
                [PriceGroupProvider::PRICE_GROUP_ID => $priceGroupId]
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($documentIdentifier, $expectedOrderedDocIds) {
                    $this->validateExpectedResults($response, $documentIdentifier, $expectedOrderedDocIds);
                }
            )
        );
    }

    public function filteredSearchDocumentsProvider(): array
    {
        return [
            [
                'b2c_fr', // catalog ID.
                [], // sort order specifications.
                'sku: { eq: "24-MB03" }',
                'entity_id', // document data identifier.
                [3], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                [], // sort order specifications.
                'category_as_nested__id: { eq: "cat_1" }',
                'entity_id', // document data identifier.
                [1, 2], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                [], // sort order specifications.
                'created_at: { gte: "2022-09-01", lte: "2022-09-05" }',
                'entity_id', // document data identifier.
                [1, 12, 11, 8, 7, 6, 4, 3, 2], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'sku: { in: ["24-MB02", "24-WB01"] }', // filter.
                'entity_id', // document data identifier.
                [6, 8], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'id: { gte: 10, lte: 12 }', // filter.
                'entity_id', // document data identifier.
                [10, 11, 12], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'id: { gt: 10, lt: 12 }', // filter.
                'entity_id', // document data identifier.
                [11], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'name: { match: "Compete Track" }', // filter.
                'entity_id', // document data identifier.
                [9], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'size: { exist: true }', // filter.
                'entity_id', // document data identifier.
                [2, 3, 4, 5, 6, 7, 9, 10, 11, 12], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'size: { exist: false }', // filter.
                'entity_id', // document data identifier.
                [8], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'is_eco_friendly: { eq: true }', // filter.
                'entity_id', // document data identifier.
                [3, 4, 5, 6], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'is_eco_friendly: { eq: false }', // filter.
                'entity_id', // document data identifier.
                [2, 7, 8, 10], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                <<<GQL
                  name: { match: "Sac" }
                  sku: { in: ["24-WB06", "24-WB03"] }
                GQL, // filter.
                'entity_id', // document data identifier.
                [11, 12], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                <<<GQL
                  boolFilter: {
                    _must: [
                      { name: { match:"Sac" }}
                      { sku: { in: ["24-WB06", "24-WB03"] }}
                    ]
                   }
                GQL, // filter.
                'entity_id', // document data identifier.
                [11, 12], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                <<<GQL
                  boolFilter: {
                    _should: [
                      { sku: { eq: "24-MB05" }}
                      { sku: { eq: "24-UB02" }}
                    ]
                   }
                GQL, // filter.
                'entity_id', // document data identifier.
                [4, 7], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                <<<GQL
                  boolFilter: {
                    _not: [
                      { name: { match:"Sac" }}
                    ]
                  }
                GQL, // filter.
                'entity_id', // document data identifier.
                [5, 9, 10], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                <<<GQL
                  boolFilter: {
                    _must: [
                      {name: {match:"Sac"}}
                    ]
                    _should: [
                      {sku: {eq: "24-WB06"}}
                      {sku: {eq: "24-WB03"}}
                    ]
                  }
                GQL, // filter.
                'entity_id', // document data identifier.
                [11, 12], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                <<<GQL
                  boolFilter: {
                    _must: [
                      {name: {match:"Sac"}}
                    ]
                    _should: [
                      {sku: {eq: "24-WB01"}}
                      {sku: {eq: "24-WB06"}}
                      {sku: {eq: "24-WB03"}}
                    ]
                    _not: [
                      {id: {eq: 11}}
                    ]
                  }
                GQL, // filter.
                'entity_id', // document data identifier.
                [8, 12], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                <<<GQL
                  boolFilter: {
                    _must: [
                      {name: {match:"Sac"}}
                      {boolFilter: {
                        _should: [
                          {sku: {eq: "24-WB06"}}
                          {sku: {eq: "24-WB03"}}
                        ]}
                      }
                    ]
                  }
                GQL, // filter.
                'entity_id', // document data identifier.
                [11, 12], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'my_price__price: {gt: 10}', // filter.
                'entity_id', // document data identifier.
                [3, 1], // expected ordered document IDs
                '0',
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'my_price__price: {gt: 10}', // filter.
                'entity_id', // document data identifier.
                [2, 3, 1], // expected ordered document IDs
                '1',
            ],
            [
                'b2c_fr', // catalog ID.
                ['id' => SortOrderInterface::SORT_ASC], // sort order specifications.
                'my_price__price: {gt: 10}', // filter.
                'entity_id', // document data identifier.
                [], // expected ordered document IDs
                'fake_price_group_id',
            ],
        ];
    }

    /**
     * @dataProvider filteredWithCategorySearchDocumentsProvider
     *
     * @param string $catalogId             Catalog ID or code
     * @param string $categoryId            Category id to search in
     * @param array  $sortOrders            Sort order specifications
     * @param string $documentIdentifier    Document identifier to check ordered results
     * @param array  $expectedOrderedDocIds Expected ordered document identifiers
     */
    public function testFilteredWithCategorySearchProducts(
        string $catalogId,
        array $sortOrders,
        string $categoryId,
        string $documentIdentifier,
        array $expectedOrderedDocIds
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);
        $arguments = sprintf(
            'requestType: product_catalog, localizedCatalog: "%s", pageSize: %d, currentPage: %d, currentCategoryId: "%s"',
            $catalogId,
            10,
            1,
            $categoryId
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
                function (ResponseInterface $response) use ($documentIdentifier, $expectedOrderedDocIds) {
                    $this->validateExpectedResults($response, $documentIdentifier, $expectedOrderedDocIds);
                }
            )
        );
    }

    public function filteredWithCategorySearchDocumentsProvider(): array
    {
        return [
            [
                'b2c_fr', // catalog ID.
                [], // sort order specifications.
                'cat_1', // current category id.
                'entity_id', // document data identifier.
                [2, 1], // expected ordered document IDs
            ],
            [
                'b2c_fr', // catalog ID.
                [], // sort order specifications.
                'cat_2', // current category id.
                'entity_id', // document data identifier.
                [1], // expected ordered document IDs
            ],
        ];
    }

    /**
     * @dataProvider searchWithAggregationDataProvider
     *
     * @param string      $requestType          Request Type
     * @param string      $catalogId            Catalog ID or code
     * @param string|null $categoryId           Category id to search in
     * @param int         $pageSize             Pagination size
     * @param int         $currentPage          Current page
     * @param array|null  $expectedAggregations Expected aggregations sample
     * @param string      $priceGroupId         Price group id
     */
    public function testSearchProductsWithAggregation(
        string $requestType,
        string $catalogId,
        ?string $categoryId,
        int $pageSize,
        int $currentPage,
        ?array $expectedAggregations,
        string $priceGroupId = '0'
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        $arguments = sprintf(
            'requestType: %s, localizedCatalog: "%s", pageSize: %d, currentPage: %d',
            $requestType,
            $catalogId,
            $pageSize,
            $currentPage
        );

        if ($categoryId) {
            $arguments .= ", currentCategoryId: \"$categoryId\"";
        }

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        products({$arguments}) {
                            collection {
                              id
                              score
                              source
                            }
                            aggregations {
                              field
                              count
                              label
                              type
                              options {
                                label
                                value
                                count
                              }
                            }
                        }
                    }
                GQL,
                $user,
                [PriceGroupProvider::PRICE_GROUP_ID => $priceGroupId]
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($expectedAggregations) {
                    // Extra test on response structure because all exceptions might not throw an HTTP error code.
                    $this->assertJsonContains([
                        'data' => [
                            'products' => [
                                'aggregations' => $expectedAggregations,
                            ],
                        ],
                    ]);
                    $responseData = $response->toArray();
                    if (\is_array($expectedAggregations)) {
                        $this->assertIsArray($responseData['data']['products']['aggregations']);
                        foreach ($responseData['data']['products']['aggregations'] as $data) {
                            $this->assertArrayHasKey('field', $data);
                            $this->assertArrayHasKey('count', $data);
                            $this->assertArrayHasKey('label', $data);
                            $this->assertArrayHasKey('options', $data);
                        }
                    } else {
                        $this->assertNull($responseData['data']['products']['aggregations']);
                    }
                }
            )
        );
    }

    public function searchWithAggregationDataProvider(): array
    {
        return [
            [
                'product_catalog',
                'b2c_en',   // catalog ID.
                null, // Current category id.
                10,     // page size.
                1,      // current page.
                [       // expected aggregations sample.
                    ['field' => 'is_eco_friendly', 'label' => 'Is_eco_friendly', 'type' => 'checkbox'],
                    ['field' => 'weight', 'label' => 'Weight', 'type' => 'slider'],
                    ['field' => 'size', 'label' => 'Size', 'type' => 'slider'],
                    [
                        'field' => 'category__id',
                        'label' => 'Category',
                        'type' => 'category',
                        'options' => [
                            [
                                'label' => 'One',
                                'value' => 'cat_1',
                                'count' => 2,
                            ],
                            [
                                'label' => 'Five',
                                'value' => 'cat_5',
                                'count' => 1,
                            ],
                        ],
                    ],
                    [
                        'field' => 'color__value',
                        'label' => 'Color',
                        'type' => 'checkbox',
                        'options' => [
                            [
                                'label' => 'Black',
                                'value' => 'black',
                                'count' => 10,
                            ],
                        ],
                    ],
                ],
            ],
            [
                'product_catalog',
                'b2c_en',   // catalog ID.
                'cat_1', // Current category id.
                10,     // page size.
                1,      // current page.
                [       // expected aggregations sample.
                    ['field' => 'is_eco_friendly', 'label' => 'Is_eco_friendly', 'type' => 'checkbox'],
                    ['field' => 'weight', 'label' => 'Weight', 'type' => 'slider'],
                    [
                        'field' => 'category__id',
                        'label' => 'Category',
                        'type' => 'category',
                        'options' => [
                            [
                                'label' => 'Three',
                                'value' => 'cat_3',
                                'count' => 2,
                            ],
                        ],
                    ],
                    [
                        'field' => 'color__value',
                        'label' => 'Color',
                        'type' => 'checkbox',
                        'options' => [
                            [
                                'label' => 'Black',
                                'value' => 'black',
                                'count' => 2,
                            ],
                        ],
                    ],
                ],
            ],
            [
                'product_catalog',
                'b2c_en',   // catalog ID.
                'cat_5', // Current category id.
                10,     // page size.
                1,      // current page.
                [       // expected aggregations sample.
                    ['field' => 'is_eco_friendly', 'label' => 'Is_eco_friendly', 'type' => 'checkbox'],
                    ['field' => 'weight', 'label' => 'Weight', 'type' => 'slider'],
                    ['field' => 'size', 'label' => 'Size', 'type' => 'slider'],
                    ['field' => 'brand__value', 'label' => 'Brand', 'type' => 'checkbox'],
                    [
                        'field' => 'color__value',
                        'label' => 'Color',
                        'type' => 'checkbox',
                        'options' => [
                            [
                                'label' => 'Black',
                                'value' => 'black',
                                'count' => 1,
                            ],
                        ],
                    ],
                ],
            ],
            [
                'product_catalog',
                'b2c_fr',   // catalog ID.
                null,   // Current category id.
                10,     // page size.
                1,      // current page.
                [       // expected aggregations sample.
                    ['field' => 'is_eco_friendly', 'label' => 'Is_eco_friendly', 'type' => 'checkbox'],
                    ['field' => 'weight', 'label' => 'Weight', 'type' => 'slider'],
                    [
                        'field' => 'size',
                        'label' => 'Taille',
                        'type' => 'slider',
                    ],
                    [
                        'field' => 'category__id',
                        'label' => 'Category',
                        'type' => 'category',
                        'options' => [
                            [
                                'label' => 'Un',
                                'value' => 'cat_1',
                                'count' => 2,
                            ],
                            [
                                'label' => 'Deux',
                                'value' => 'cat_2',
                                'count' => 1,
                            ],
                        ],
                    ],
                    [
                        'field' => 'color__value',
                        'label' => 'Couleur',
                        'type' => 'checkbox',
                        'options' => [
                            [
                                'label' => 'Noir',
                                'value' => 'black',
                                'count' => 9,
                            ],
                        ],
                    ],
                ],
            ],
            [
                'test_search_query',
                'b2c_fr',   // catalog ID.
                null,   // Current category id.
                10,     // page size.
                1,      // current page.
                null,   // expected aggregations sample.
            ],
            [
                'product_catalog',
                'b2c_fr',   // catalog ID.
                'cat_1', // Current category id.
                10,     // page size.
                1,      // current page.
                [       // expected aggregations sample.
                    ['field' => 'is_eco_friendly', 'label' => 'Is_eco_friendly', 'type' => 'checkbox'],
                    ['field' => 'weight', 'label' => 'Weight', 'type' => 'slider'],
                    [
                        'field' => 'my_price__price',
                        'label' => 'My_price',
                        'type' => 'slider',
                        'options' => [
                            [
                                'label' => '8',
                                'value' => '8',
                                'count' => 1,
                            ],
                            [
                                'label' => '10',
                                'value' => '10',
                                'count' => 1,
                            ],
                        ],
                    ],
                    ['field' => 'category__id', 'label' => 'Category', 'type' => 'category'],
                    ['field' => 'color__value', 'label' => 'Couleur', 'type' => 'checkbox'],
                ],
                '0',
            ],
            [
                'product_catalog',
                'b2c_fr',   // catalog ID.
                'cat_1', // Current category id.
                10,     // page size.
                1,      // current page.
                [       // expected aggregations sample.
                    ['field' => 'is_eco_friendly', 'label' => 'Is_eco_friendly', 'type' => 'checkbox'],
                    ['field' => 'weight', 'label' => 'Weight', 'type' => 'slider'],
                    [
                        'field' => 'my_price__price',
                        'label' => 'My_price',
                        'type' => 'slider',
                        'options' => [
                            [
                                'label' => '10',
                                'value' => '10',
                                'count' => 1,
                            ],
                            [
                                'label' => '17',
                                'value' => '17',
                                'count' => 1,
                            ],
                        ],
                    ],
                    ['field' => 'category__id', 'label' => 'Category', 'type' => 'category'],
                    ['field' => 'color__value', 'label' => 'Couleur', 'type' => 'checkbox'],
                ],
                '1',
            ],
            [
                'product_catalog',
                'b2c_fr',   // catalog ID.
                'cat_1', // Current category id.
                10,     // page size.
                1,      // current page.
                [       // expected aggregations sample.
                    ['field' => 'is_eco_friendly', 'label' => 'Is_eco_friendly', 'type' => 'checkbox'],
                    ['field' => 'weight', 'label' => 'Weight', 'type' => 'slider'],
                    ['field' => 'category__id', 'label' => 'Category', 'type' => 'category'],
                    ['field' => 'color__value', 'label' => 'Couleur', 'type' => 'checkbox'],
                ],
                'fake_price_group_id',
            ],
        ];
    }

    /**
     * @dataProvider searchWithAggregationAndFilterDataProvider
     *
     * @param string      $catalogId            Catalog ID or code
     * @param int         $pageSize             Pagination size
     * @param int         $currentPage          Current page
     * @param string|null $filter               Filters to apply
     * @param array       $expectedOptionsCount expected aggregation option count
     */
    public function testSearchProductsWithAggregationAndFilter(
        string $catalogId,
        int $pageSize,
        int $currentPage,
        ?string $filter,
        array $expectedOptionsCount,
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        $arguments = sprintf(
            'requestType: product_catalog, localizedCatalog: "%s", pageSize: %d, currentPage: %d',
            $catalogId,
            $pageSize,
            $currentPage,
        );
        if ($filter) {
            $arguments = sprintf(
                'requestType: product_catalog, localizedCatalog: "%s", pageSize: %d, currentPage: %d, filter: [%s]',
                $catalogId,
                $pageSize,
                $currentPage,
                $filter,
            );
        }

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        products({$arguments}) {
                            aggregations {
                              field
                              count
                              options {
                                value
                              }
                            }
                        }
                    }
                GQL,
                $user
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($expectedOptionsCount) {
                    $responseData = $response->toArray();
                    $this->assertIsArray($responseData['data']['products']['aggregations']);
                    foreach ($responseData['data']['products']['aggregations'] as $data) {
                        if (\array_key_exists($data['field'], $expectedOptionsCount)) {
                            $this->assertCount($expectedOptionsCount[$data['field']], $data['options'] ?? []);
                        }
                    }
                }
            )
        );
    }

    public function searchWithAggregationAndFilterDataProvider(): array
    {
        return [
            [
                'b2c_en',   // catalog ID.
                10,     // page size.
                1,      // current page.
                null, // filter.
                [ // expected option result
                    'color__value' => 9,
                    'category__id' => 2,
                    'is_eco_friendly' => 2,
                ],
            ],
            [
                'b2c_en',   // catalog ID.
                10,     // page size.
                1,      // current page.
                '{sku: {eq: "24-WB05"}}', // filter.
                [ // expected option result
                    'color__value' => 1,
                    'category__id' => 0,
                    'is_eco_friendly' => 1,
                ],
            ],
            [
                'b2c_en',   // catalog ID.
                10,     // page size.
                1,      // current page.
                '{color__value: {in: ["pink"]}}', // filter.
                [ // expected option result
                    'color__value' => 9,
                    'category__id' => 0,
                    'is_eco_friendly' => 1,
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

    /**
     * Validate result in search products response.
     *
     * @param ResponseInterface $response              Api response to validate
     * @param string            $documentIdentifier    Document identifier to check ordered results
     * @param array             $expectedOrderedDocIds Expected ordered document identifiers
     */
    private function validateExpectedResults(ResponseInterface $response, string $documentIdentifier, array $expectedOrderedDocIds): void
    {
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
}
