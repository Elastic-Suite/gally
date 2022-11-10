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

use Elasticsuite\Fixture\Service\ElasticsearchFixturesInterface;
use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class SearchProductsHydrationTest extends AbstractTest
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::loadFixture([
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
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
        ?string $attributes,
        ?int $pageSize,
        ?int $currentPage,
        ?array $expectedError,
        ?int $expectedItemsCount,
        ?int $expectedTotalCount,
        ?int $expectedItemsPerPage,
        ?int $expectedLastPage,
        ?string $expectedIndexAlias,
        ?float $expectedScore,
        ?array $expectedAttributes
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        $arguments = sprintf(
            'requestType: product_catalog, catalogId: "%s"',
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
                              _id
                              {$attributes}
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
                    $expectedScore,
                    $expectedAttributes
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

                            $this->assertArrayHasKey('_id', $document);
                            $this->assertArraySubset($expectedAttributes[$document['_id']], $document);
                        }
                    }
                }
            )
        );
    }

    public function basicSearchProductsDataProvider(): array
    {
        $attributes = <<<ATT
            name
            description
            sku
            brand { label value }
            color { label value }
            length
            weight
            size
            is_eco_friendly
            stock_as_nested { status qty }
            stock { status qty }
            price_as_nested { group_id original_price price is_discounted }
            price { group_id original_price price is_discounted }
            category_as_nested { id }
            category { id uid name is_parent is_virtual is_blacklisted position }
        ATT;

        $productData = [
            'b2c_en' => [
                '1' => [
                    '_id' => '1',
                    'sku' => '24-MB01',
                    'name' => 'Joust Duffle Bag',
                    'description' => 'A super bag for winter.',
                    // 'seller_reference' => 'dufflebag',
                    'length' => null,
                    'weight' => 1.200,
                    'size' => 12,
                    'is_eco_friendly' => false,
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'black',
                            'label' => 'Black',
                        ],
                    ],
                    'stock' => null,
                    'stock_as_nested' => null,
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-01',
                ],
                '2' => [
                    '_id' => '2',
                    'sku' => '24-MB04',
                    'name' => 'Strive Shoulder Pack',
                    'description' => 'A super bag for spring.',
                    // 'seller_reference' => 'striveshoulder',
                    'length' => null,
                    'weight' => 1.100,
                    'size' => 5,
                    'is_eco_friendly' => false,
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'black',
                            'label' => 'Black',
                        ],
                    ],
                    'stock' => null,
                    'stock_as_nested' => null,
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-05',
                ],
                '3' => [
                    '_id' => '3',
                    'sku' => '24-MB03',
                    'name' => 'Crown Summit Backpack',
                    'description' => 'A super bag for summer and yoga.',
                    'length' => null,
                    'weight' => 0.750,
                    'size' => 8,
                    'is_eco_friendly' => true,
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'black',
                            'label' => 'Black',
                        ],
                        [
                            'value' => 'grey',
                            'label' => 'Grey',
                        ],
                    ],
                    'stock' => null,
                    'stock_as_nested' => null,
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-05',
                ],
                '4' => [
                    '_id' => '4',
                    'sku' => '24-MB05',
                    'name' => 'Wayfarer Messenger Bag',
                    'description' => 'A super bag for autumn.',
                    'length' => null,
                    'weight' => null,
                    'size' => 7,
                    'is_eco_friendly' => true,
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'black',
                            'label' => 'Black',
                        ],
                    ],
                    'stock' => null,
                    'stock_as_nested' => null,
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-05',
                ],
                '5' => [
                    '_id' => '5',
                    'sku' => '24-MB06',
                    'name' => 'Rival Field Messenger',
                    'description' => 'A super bag for summer.',
                    'length' => null,
                    'weight' => null,
                    'size' => 2,
                    'is_eco_friendly' => true,
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'grey',
                            'label' => 'Grey',
                        ],
                    ],
                    'stock' => null,
                    'stock_as_nested' => null,
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-06',
                ],
                '6' => [
                    '_id' => '6',
                    'sku' => '24-MB02',
                    'name' => 'Fusion Backpack',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 9,
                    'is_eco_friendly' => true,
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'grey',
                            'label' => 'Grey',
                        ],
                        [
                            'value' => 'black',
                            'label' => 'Black',
                        ],
                        [
                            'value' => 'red',
                            'label' => 'Red',
                        ],
                    ],
                    'stock' => null,
                    'stock_as_nested' => null,
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-01',
                ],
                '7' => [
                    '_id' => '7',
                    'sku' => '24-UB02',
                    'name' => 'Impulse Duffle',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 11,
                    'is_eco_friendly' => false,
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'black',
                            'label' => 'Black',
                        ],
                    ],
                    'stock' => null,
                    'stock_as_nested' => null,
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-01',
                ],
                '8' => [
                    '_id' => '8',
                    'sku' => '24-WB01',
                    'name' => 'Voyage Yoga Bag',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 4,
                    'is_eco_friendly' => false,
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'black',
                            'label' => 'Black',
                        ],
                        [
                            'value' => 'white',
                            'label' => 'White',
                        ],
                    ],
                    'stock' => null,
                    'stock_as_nested' => null,
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-01',
                ],
                '9' => [
                    '_id' => '9',
                    'sku' => '24-WB02',
                    'name' => 'Compete Track Tote',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 11,
                    'is_eco_friendly' => false,
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'green',
                            'label' => 'Green',
                        ],
                        [
                            'value' => 'white',
                            'label' => 'White',
                        ],
                    ],
                    'stock' => null,
                    'stock_as_nested' => null,
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-01',
                ],
                '10' => [
                    '_id' => '10',
                    'sku' => '24-WB05',
                    'name' => 'Savvy Shoulder Tote',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 2,
                    'is_eco_friendly' => false,
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'pink',
                            'label' => 'Pink',
                        ],
                    ],
                    'stock' => null,
                    'stock_as_nested' => null,
                    'price_as_nested' => null,
                    'price' => null,
                ],
                '11' => [
                    '_id' => '11',
                    'sku' => '24-WB06',
                    'name' => 'Endeavor Daytrip Backpack',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 5,
                    'is_eco_friendly' => null,
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'pink',
                            'label' => 'Pink',
                        ],
                        [
                            'value' => 'fuchsia',
                            'label' => 'Fuchsia',
                        ],
                        [
                            'value' => 'grey',
                            'label' => 'Grey',
                        ],
                        [
                            'value' => 'black',
                            'label' => 'Black',
                        ],
                    ],
                    'stock' => null,
                    'stock_as_nested' => null,
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-01',
                ],
                '12' => [
                    '_id' => '12',
                    'sku' => '24-WB03',
                    'name' => 'Driven Backpack',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 12,
                    'is_eco_friendly' => null,
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'grey',
                            'label' => 'Grey',
                        ],
                        [
                            'value' => 'black',
                            'label' => 'Black',
                        ],
                    ],
                    'stock' => null,
                    'stock_as_nested' => null,
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-01',
                ],
                '13' => [
                    '_id' => '13',
                    'sku' => '24-WB07',
                    'name' => 'Overnight Duffle',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 10,
                    'is_eco_friendly' => null,
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'brown',
                            'label' => 'Brown',
                        ],
                    ],
                    'stock' => null,
                    'stock_as_nested' => null,
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-01',
                ],
                '14' => [
                    '_id' => '14',
                    'sku' => '24-WB04',
                    'name' => 'Push It Messenger Bag',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 9,
                    'is_eco_friendly' => null,
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'grey',
                            'label' => 'Grey',
                        ],
                        [
                            'value' => 'blue',
                            'label' => 'Blue',
                        ],
                        [
                            'value' => 'black',
                            'label' => 'Black',
                        ],
                    ],
                    'stock' => null,
                    'stock_as_nested' => null,
                    'price_as_nested' => null,
                    'price' => null,
                ],
            ],
            'b2c_fr' => [
                '1' => [
                    '_id' => '1',
                    'sku' => '24-MB01',
                    'name' => 'Sac de sport Jout',
                    'description' => null,
                    'length' => null,
                    'weight' => 1.200,
                    'size' => 12,
                    'is_eco_friendly' => false,
                    'price_as_nested' => [
                        /* nested fields are always single value for the time being
                        [
                            'group_id' => 0,
                            'original_price' => 11.99,
                            'price' => 10.99,
                            'is_discounted' => true,
                        ],
                        [
                            'group_id' => 1,
                            'original_price' => 11.99,
                            'price' => 10.99,
                            'is_discounted' => true,
                        ], */
                        'group_id' => 0,
                        'original_price' => 11.99,
                        'price' => 10.99,
                        'is_discounted' => true,
                    ],
                    'price' => [
                        /* price source fields are always multiple values for the time being */
                        [
                            'group_id' => 0,
                            'original_price' => 11.99,
                            'price' => 10.99,
                            'is_discounted' => true,
                        ],
                        [
                            'group_id' => 1,
                            'original_price' => 11.99,
                            'price' => 10.99,
                            'is_discounted' => true,
                        ],
                    ],
                    'stock' => [
                        'status' => false,
                        'qty' => 0,
                    ],
                    'stock_as_nested' => [
                        'status' => false,
                        'qty' => 0,
                    ],
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'black',
                            'label' => 'Noir',
                        ],
                    ],
                    'category_as_nested' => [
                        /* nested fields are always single value for the time being
                        [
                            'id' => 'one',
                        ],
                        */
                        'id' => 'one',
                    ],
                    'category' => [
                        [
                            'id' => 'one',
                            'uid' => 'one',
                            'name' => 'One',
                            'is_parent' => true,
                            'is_virtual' => false,
                            'is_blacklisted' => false,
                        ],
                        [
                            'id' => 'two',
                            'uid' => 'two',
                            'name' => 'Two',
                            'is_parent' => false,
                            'is_virtual' => false,
                            'is_blacklisted' => false,
                            'position' => 1,
                        ],
                    ],
                    // 'created_at' => '2022-09-01',
                ],
                '2' => [
                    '_id' => '2',
                    'sku' => '24-MB04',
                    'name' => 'Sac à bandoulière Strive',
                    'description' => null,
                    'length' => null,
                    'weight' => 1.100,
                    'size' => 5,
                    'is_eco_friendly' => false,
                    'price_as_nested' => [
                        /* nested fields are always single value for the time being
                        [
                            'group_id' => 0,
                            'original_price' => 17.99,
                            'price' => 8.99,
                            'is_discounted' => true,
                        ],
                        [
                            'group_id' => 1,
                            'original_price' => 17.99,
                            'price' => 17.99,
                            'is_discounted' => false,
                        ], */
                        'group_id' => 0,
                        'original_price' => 17.99,
                        'price' => 8.99,
                        'is_discounted' => true,
                    ],
                    'price' => [
                        /* price source fields are always multiple values for the time being */
                        [
                            'group_id' => 0,
                            'original_price' => 17.99,
                            'price' => 8.99,
                            'is_discounted' => true,
                        ],
                        [
                            'group_id' => 1,
                            'original_price' => 17.99,
                            'price' => 17.99,
                            'is_discounted' => false,
                        ],
                    ],
                    'stock' => [
                        'status' => true,
                        'qty' => 37,
                    ],
                    'stock_as_nested' => [
                        'status' => true,
                        'qty' => 37,
                    ],
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'black',
                            'label' => 'Noir',
                        ],
                    ],
                    'category_as_nested' => [
                        /* nested fields are always single value for the time being
                        [
                            'id' => 'one',
                        ],
                        */
                        'id' => 'one',
                    ],
                    'category' => [
                        [
                            'id' => 'one',
                            'uid' => 'one',
                            'name' => 'One',
                            'is_parent' => true,
                            'is_virtual' => false,
                            'is_blacklisted' => false,
                            'position' => 1,
                        ],
                    ],
                    // 'created_at' => '2022-09-05',
                ],
                '3' => [
                    '_id' => '3',
                    'sku' => '24-MB03',
                    'name' => 'Sac à dos Crown Summit',
                    'description' => null,
                    'length' => null,
                    'weight' => 0.750,
                    'size' => 8,
                    'is_eco_friendly' => true,
                    'price_as_nested' => [
                        /* nested fields are always single value for the time being
                        [
                            'group_id' => 0,
                            'original_price' => 25.99,
                            'price' => 25.99,
                            'is_discounted' => false,
                        ],
                        [
                            'group_id' => 1,
                            'original_price' => 25.99,
                            'price' => 20.99,
                            'is_discounted' => true,
                        ], */
                        'group_id' => 0,
                        'original_price' => 25.99,
                        'price' => 25.99,
                        'is_discounted' => false,
                    ],
                    'price' => [
                        /* price source fields are always multiple values for the time being */
                        [
                            'group_id' => 0,
                            'original_price' => 25.99,
                            'price' => 25.99,
                            'is_discounted' => false,
                        ],
                        [
                            'group_id' => 1,
                            'original_price' => 25.99,
                            'price' => 20.99,
                            'is_discounted' => true,
                        ],
                    ],
                    'stock' => [
                        'status' => true,
                        'qty' => 12,
                    ],
                    'stock_as_nested' => [
                        'status' => true,
                        'qty' => 12,
                    ],
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'black',
                            'label' => 'Noir',
                        ],
                        [
                            'value' => 'grey',
                            'label' => 'Gris',
                        ],
                    ],
                    // 'created_at' => '2022-09-05',
                ],
                '4' => [
                    '_id' => '4',
                    'sku' => '24-MB05',
                    'name' => 'Sac messager Wayfarer',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 7,
                    'is_eco_friendly' => true,
                    'stock' => [
                        'status' => false,
                        'qty' => 0,
                    ],
                    'stock_as_nested' => [
                        'status' => false,
                        'qty' => 0,
                    ],
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'black',
                            'label' => 'Noir',
                        ],
                    ],
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-05',
                ],
                '5' => [
                    '_id' => '5',
                    'sku' => '24-MB06',
                    'name' => 'Messager de terrain rival',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 2,
                    'is_eco_friendly' => true,
                    'stock' => [
                        'status' => true,
                        'qty' => 3,
                    ],
                    'stock_as_nested' => [
                        'status' => true,
                        'qty' => 3,
                    ],
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'grey',
                            'label' => 'Gris',
                        ],
                    ],
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-06',
                ],
                '6' => [
                    '_id' => '6',
                    'sku' => '24-MB02',
                    'name' => 'Sac à dos Fusion',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 9,
                    'is_eco_friendly' => true,
                    'stock' => [
                        'status' => false,
                        'qty' => 24,
                    ],
                    'stock_as_nested' => [
                        'status' => false,
                        'qty' => 24,
                    ],
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'grey',
                            'label' => 'Gris',
                        ],
                        [
                            'value' => 'black',
                            'label' => 'Noir',
                        ],
                        [
                            'value' => 'red',
                            'label' => 'Rouge',
                        ],
                    ],
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-01',
                ],
                '7' => [
                    '_id' => '7',
                    'sku' => '24-UB02',
                    'name' => 'Sac de sport Impulse',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 11,
                    'is_eco_friendly' => false,
                    'stock' => [
                        'status' => false,
                        'qty' => 7,
                    ],
                    'stock_as_nested' => [
                        'status' => false,
                        'qty' => 7,
                    ],
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'black',
                            'label' => 'Noir',
                        ],
                    ],
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-01',
                ],
                '8' => [
                    '_id' => '8',
                    'sku' => '24-WB01',
                    'name' => 'Sac de voyage Yoga',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => null,
                    'is_eco_friendly' => false,
                    'stock' => [
                        'status' => false,
                        'qty' => -2,
                    ],
                    'stock_as_nested' => [
                        'status' => false,
                        'qty' => -2,
                    ],
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'black',
                            'label' => 'Noir',
                        ],
                        [
                            'value' => 'white',
                            'label' => 'Blanc',
                        ],
                    ],
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-01',
                ],
                '9' => [
                    '_id' => '9',
                    'sku' => '24-WB02',
                    'name' => 'Fourre-tout Compete Track',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 11,
                    'is_eco_friendly' => false,
                    'stock' => [
                        'status' => false,
                        'qty' => 0,
                    ],
                    'stock_as_nested' => [
                        'status' => false,
                        'qty' => 0,
                    ],
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'green',
                            'label' => 'Vert',
                        ],
                        [
                            'value' => 'white',
                            'label' => 'Blanc',
                        ],
                    ],
                    'price_as_nested' => null,
                    'price' => null,
                ],
                '10' => [
                    '_id' => '10',
                    'sku' => '24-WB05',
                    'name' => 'Fourre-tout à bandoulière avisé',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 2,
                    'is_eco_friendly' => false,
                    'stock' => [
                        'status' => true,
                        'qty' => 8,
                    ],
                    'stock_as_nested' => [
                        'status' => true,
                        'qty' => 8,
                    ],
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'pink',
                            'label' => 'Rose',
                        ],
                    ],
                    'price_as_nested' => null,
                    'price' => null,
                ],
                '11' => [
                    '_id' => '11',
                    'sku' => '24-WB06',
                    'name' => "Sac à dos d'excursion d'une journée Endeavour",
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 5,
                    'is_eco_friendly' => null,
                    'stock' => [
                        'status' => true,
                        'qty' => 13,
                    ],
                    'stock_as_nested' => [
                        'status' => true,
                        'qty' => 13,
                    ],
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'pink',
                            'label' => 'Rose',
                        ],
                        [
                            'value' => 'fuchsia',
                            'label' => 'Fuchsia',
                        ],
                        [
                            'value' => 'grey',
                            'label' => 'Gris',
                        ],
                        [
                            'value' => 'black',
                            'label' => 'Noir',
                        ],
                    ],
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-01',
                ],
                '12' => [
                    '_id' => '12',
                    'sku' => '24-WB03',
                    'name' => 'Sac à dos piloté',
                    'description' => null,
                    'length' => null,
                    'weight' => null,
                    'size' => 12,
                    'is_eco_friendly' => null,
                    'stock' => [
                        'status' => true,
                        'qty' => 17,
                    ],
                    'stock_as_nested' => [
                        'status' => true,
                        'qty' => 17,
                    ],
                    'brand' => null,
                    'color' => [
                        [
                            'value' => 'grey',
                            'label' => 'Gris',
                        ],
                        [
                            'value' => 'black',
                            'label' => 'Noir',
                        ],
                    ],
                    'price_as_nested' => null,
                    'price' => null,
                    // 'created_at' => '2022-09-01',
                ],
            ],
        ];

        return [
            [
                'b2c_uk',   // catalog ID.
                $attributes,
                null,   // page size.
                null,   // current page.
                ['errors' => [['message' => 'Internal server error', 'debugMessage' => 'Missing catalog [b2c_uk]']]], // expected error.
                null,   // expected items count.
                null,   // expected total count.
                null,   // expected items per page.
                null,   // expected last page.
                null,   // expected index.
                null,   // expected score.
                null,   // expected attributes.
            ],
            [
                '2',    // catalog ID.
                $attributes,
                10,     // page size.
                1,      // current page.
                [],     // expected error.
                10,     // expected items count.
                14,     // expected total count.
                10,     // expected items per page.
                2,      // expected last page.
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_b2c_en_product', // expected index alias.
                1.0,    // expected score.
                $productData['b2c_en'], // expected product data.
            ],
            [
                'b2c_en',   // catalog ID.
                $attributes,
                10,     // page size.
                1,      // current page.
                [],     // expected error.
                10,     // expected items count.
                14,     // expected total count.
                10,     // expected items per page.
                2,      // expected last page.
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_b2c_en_product', // expected index alias.
                1.0,    // expected score.
                $productData['b2c_en'], // expected product data.
            ],
            [
                'b2c_en',   // catalog ID.
                $attributes,
                10,     // page size.
                2,      // current page.
                [],     // expected error.
                4,      // expected items count.
                14,     // expected total count.
                10,     // expected items per page.
                2,      // expected last page.
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_b2c_en_product', // expected index alias.
                1.0,    // expected score.
                $productData['b2c_en'], // expected product data.
            ],
            [
                'b2c_fr',   // catalog ID.
                $attributes,
                null,   // page size.
                null,   // current page.
                [],     // expected error.
                12,     // expected items count.
                12,     // expected total count.
                30,     // expected items per page.
                1,      // expected last page.
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_b2c_fr_product', // expected index alias.
                1.0,    // expected score.
                $productData['b2c_fr'], // expected product data.
            ],
            [
                'b2c_fr',   // catalog ID.
                $attributes,
                5,      // page size.
                2,      // current page.
                [],     // expected error.
                5,      // expected items count.
                12,     // expected total count.
                5,      // expected items per page.
                3,      // expected last page.
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_b2c_fr_product', // expected index alias.
                1.0,    // expected score.
                $productData['b2c_fr'], // expected product data.
            ],
            [
                'b2c_fr',   // catalog ID.
                $attributes,
                1000,   // page size.
                null,   // current page.
                [],     // expected error.
                12,     // expected items count.
                12,     // expected total count.
                100,    // expected items per page.
                1,      // expected last page.
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_b2c_fr_product', // expected indexalias.
                1.0,    // expected score.
                $productData['b2c_fr'], // expected product data.
            ],
        ];
    }
}
