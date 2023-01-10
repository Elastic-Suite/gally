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

namespace Elasticsuite\Category\Tests\Api\GraphQl;

use Elasticsearch\Client;
use Elasticsuite\Category\Service\CategoryProductPositionManager;
use Elasticsuite\Category\Tests\Api\CategoryTestTrait;
use Elasticsuite\Index\Service\IndexSettings;
use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Elasticsuite\User\Model\User;
use Symfony\Contracts\HttpClient\ResponseInterface;

class CategoryProductMerchandisingTest extends AbstractTest
{
    use CategoryTestTrait;

    protected static Client $client;
    protected static IndexSettings $indexSettings;
    protected static array $subCategoryFields;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::$client = static::getContainer()->get('api_platform.elasticsearch.client');
        self::$indexSettings = static::getContainer()->get(IndexSettings::class);
        self::$subCategoryFields = ['position'];

        self::loadFixture([
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/categories.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/configurations.yaml',
        ]);
        self::createEntityElasticsearchIndices('product');
        self::loadElasticsearchDocumentFixtures([__DIR__ . '/../../fixtures/product_documents.json']);
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::deleteEntityElasticsearchIndices('product');
    }

    public function testSecurity(): void
    {
        $this->modifyPositions(null, 'one', 1, 1, '[]', [], 'Access Denied.', 200);
        $this->modifyPositions($this->getUser(ROLE::ROLE_CONTRIBUTOR), 'one', 1, 1, '[]', [], 'Access Denied.', 200);
        $this->getPositions(null, 'one', 1, 1, '[]', [], 'Access Denied.', 200);
        $this->getPositions($this->getUser(ROLE::ROLE_CONTRIBUTOR), 'one', 1, 1, '[]', [], 'Access Denied.', 200);
    }

    /**
     * @dataProvider inputErrorsDataProvider
     */
    public function testInputErrors(
        string $categoryId,
        ?int $catalogId,
        ?int $localizedCatalogId,
        ?string $positions,
        ?string $expectedError,
        int $expectedStatus
    ): void {
        $this->modifyPositions(
            $this->getUser(ROLE::ROLE_ADMIN),
            $categoryId,
            $catalogId,
            $localizedCatalogId,
            $positions,
            [],
            $expectedError,
            $expectedStatus
        );
    }

    public function inputErrorsDataProvider(): array
    {
        return [
            ['fake_category_id', null, null, '[]', 'Category with id fake_category_id not found.', 200],
            ['one', 999, null, '[]', 'Catalog with id 999 not found.', 200],
            ['one', 1, 999, '[]', 'Localized catalog with id 999 not found.', 200],
            ['one', 1, 1, '[wrong JSON]', 'JSON positions object cannot be decoded.', 200],
            [
                'one',
                1,
                1,
                json_encode([['productId' => null, 'position' => 1], ['productId' => 2, 'position' => 2]]),
                "In positions array, position #0 is wrong: 'productId or position is missing, empty or not a numeric'",
                200,
            ],
            [
                'one',
                1,
                1,
                json_encode([['productId' => 1, 'position' => null], ['productId' => 2, 'position' => 2]]),
                "In positions array, position #0 is wrong: 'productId or position is missing, empty or not a numeric'",
                200,
            ],
            [
                'one',
                1,
                1,
                json_encode([['productId' => 'one', 'position' => 1], ['productId' => 2, 'position' => 2]]),
                "In positions array, position #0 is wrong: 'productId or position is missing, empty or not a numeric'",
                200,
            ],
            [
                'one',
                1,
                1,
                json_encode([['productId' => 1, 'position' => 'one'], ['productId' => 2, 'position' => 2]]),
                "In positions array, position #0 is wrong: 'productId or position is missing, empty or not a numeric'",
                200,
            ],
            [
                'one',
                1,
                1,
                json_encode(array_fill(0, CategoryProductPositionManager::MAX_POSITION_COUNT + 1, ['productId' => 1, 'position' => 1])),
                sprintf('Position count exceeds maximum limit %d', CategoryProductPositionManager::MAX_POSITION_COUNT),
                200,
            ],
            [
                'one',
                1,
                1,
                json_encode([['productId' => 1, 'position' => 2], ['productId' => 1, 'position' => 1], ['productId' => 2, 'position' => 2]]),
                "In positions array, the product id '1' appears twice.",
                200,
            ],
        ];
    }

    /**
     * @dataProvider modifyPositionsDataProvider
     */
    public function testModifyPositions(
        User $user,
        string $categoryId,
        ?int $catalogId,
        ?int $localizedCatalogId,
        string $positions,
        array $expectedPositions,
        ?string $expectedError,
        int $expectedStatus
    ): void {
        $this->modifyPositions($user, $categoryId, $catalogId, $localizedCatalogId, $positions, $expectedPositions, $expectedError, $expectedStatus);
    }

    /**
     * @dataProvider modifyPositionsDataProvider
     */
    private function modifyPositions(
        ?User $user,
        string $categoryId,
        ?int $catalogId,
        ?int $localizedCatalogId,
        ?string $positions,
        array $expectedPositions,
        ?string $expectedError,
        int $expectedStatus
    ): void {
        $localizedCatalogIdArg = $localizedCatalogId ?? 'null';
        $catalogIdArg = $catalogId ?? 'null';
        $positions = addslashes($positions);
        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    mutation {
                      savePositionsCategoryProductMerchandising(input: {
                        categoryId: "$categoryId"
                        localizedCatalogId: $localizedCatalogIdArg
                        catalogId: $catalogIdArg
                        positions: "$positions"
                      }) {
                        categoryProductMerchandising {
                          id
                          result
                        }
                      }
                    }
                GQL,
                $user,
            ),
            new ExpectedResponse(
                $expectedStatus,
                function (ResponseInterface $response) use ($expectedPositions, $expectedError) {
                    if (null !== $expectedError) {
                        $this->assertJsonContains([
                            'errors' => [
                                [
                                    'debugMessage' => $expectedError,
                                ],
                            ],
                        ]);
                    } else {
                        $this->assertJsonContains([
                            'data' => [
                                'savePositionsCategoryProductMerchandising' => [
                                    'categoryProductMerchandising' => [
                                        'id' => '/category_product_merchandisings/0',
                                    ],
                                ],
                            ],
                        ]);
                        $this->checkPositionDataFromEs($expectedPositions);
                    }
                }
            )
        );
    }

    public function modifyPositionsDataProvider(): array
    {
        $admin = $this->getUser(Role::ROLE_ADMIN);
        $productId1 = 1;
        $productId2 = 2;
        $productId3 = 3;
        $productId4 = 4;
        $categoryIdOne = 'one';
        $categoryIdTwo = 'two';
        $categoryIdThree = 'three';
        $catalogIdB2c = 1;
        $catalogIdB2b = 2;
        $localizedCatalogIdB2cFr = 1;
        $localizedCatalogIdB2cEn = 2;
        $localizedCatalogIdb2bEn = 3;

        return [
            [ // Add global config.
                $admin,
                $categoryIdOne,
                null, // catalogId
                null, // localizedCatalogId
                json_encode([['productId' => 1, 'position' => 1], ['productId' => 2, 'position' => 2]]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // If the category id not present in the ES document the position is not added.
                $admin,
                $categoryIdThree,
                null, // catalogId
                null, // localizedCatalogId
                json_encode([['productId' => 1, 'position' => 1], ['productId' => 2, 'position' => 2]]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Add catalog config.
                $admin,
                $categoryIdOne,
                $catalogIdB2b, // catalogId
                null, // localizedCatalogId
                json_encode([['productId' => 1, 'position' => 10], ['productId' => 2, 'position' => 20]]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Add localized config.
                $admin,
                $categoryIdOne,
                $catalogIdB2c, // catalogId
                $localizedCatalogIdB2cEn, // localizedCatalogId
                json_encode([['productId' => 1, 'position' => 100], ['productId' => 2, 'position' => 200]]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 100], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Update global config.
                $admin,
                $categoryIdOne,
                null, // catalogId
                null, // localizedCatalogId
                json_encode([['productId' => 1, 'position' => 3], ['productId' => 2, 'position' => 4]]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 3], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 100], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Update catalog config.
                $admin,
                $categoryIdOne,
                $catalogIdB2b, // catalogId
                null, // localizedCatalogId
                json_encode([['productId' => 1, 'position' => 11], ['productId' => 2, 'position' => 21]]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 3], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 100], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 11], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 21], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Update localized config.
                $admin,
                $categoryIdOne,
                $catalogIdB2c, // catalogId
                $localizedCatalogIdB2cEn, // localizedCatalogId
                json_encode([['productId' => 1, 'position' => 101], ['productId' => 2, 'position' => 201]]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 3], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 101], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 201], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 11], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 21], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Add catalog config.
                $admin,
                $categoryIdOne,
                $catalogIdB2c, // catalogId
                null, // localizedCatalogId
                json_encode([['productId' => 1, 'position' => 50], ['productId' => 2, 'position' => 51]]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 50], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 51], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 101], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 201], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 11], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 21], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Delete localized config.
                $admin,
                $categoryIdOne,
                $catalogIdB2c, // catalogId
                $localizedCatalogIdB2cEn, // localizedCatalogId
                json_encode([]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 50], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 51], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 50], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 51], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 11], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 21], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Delete catalog config.
                $admin,
                $categoryIdOne,
                $catalogIdB2c, // catalogId
                null, // localizedCatalogId
                json_encode([]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 3], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 3], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 11], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 21], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Delete catalog config.
                $admin,
                $categoryIdOne,
                $catalogIdB2b, // catalogId
                null, // localizedCatalogId
                json_encode([]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 3], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 3], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 3], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Delete global config.
                $admin,
                $categoryIdOne,
                null, // catalogId
                null, // localizedCatalogId
                json_encode([]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Re-add global config.
                $admin,
                $categoryIdOne,
                null, // catalogId
                null, // localizedCatalogId
                json_encode([['productId' => 1, 'position' => 1], ['productId' => 2, 'position' => 2]]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Re-add catalog config.
                $admin,
                $categoryIdOne,
                $catalogIdB2b, // catalogId
                null, // localizedCatalogId
                json_encode([['productId' => 1, 'position' => 10], ['productId' => 2, 'position' => 20]]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Re-add localized config.
                $admin,
                $categoryIdOne,
                $catalogIdB2c, // catalogId
                $localizedCatalogIdB2cEn, // localizedCatalogId
                json_encode([['productId' => 1, 'position' => 100], ['productId' => 2, 'position' => 200]]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 1], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 100], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Delete global config.
                $admin,
                $categoryIdOne,
                null, // catalogId
                null, // localizedCatalogId
                json_encode([]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 100], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Add catalog config.
                $admin,
                $categoryIdOne,
                $catalogIdB2c, // catalogId
                null, // localizedCatalogId
                json_encode([['productId' => 1, 'position' => 1000], ['productId' => 2, 'position' => 2000]]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 1000], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2000], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 100], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Delete catalog config.
                $admin,
                $categoryIdOne,
                $catalogIdB2b, // catalogId
                null, // localizedCatalogId
                json_encode([]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 1000], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2000], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 100], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Delete catalog config.
                $admin,
                $categoryIdOne,
                $catalogIdB2c, // catalogId
                null, // localizedCatalogId
                json_encode([]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 100], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
            [ // Delete localized config.
                $admin,
                $categoryIdOne,
                $catalogIdB2c, // catalogId
                $localizedCatalogIdB2cEn, // localizedCatalogId
                json_encode([]),
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => [], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                ],
                null,
                200,
            ],
        ];
    }

    /**
     * @depends testModifyPositions
     * @dataProvider getPositionsDataProvider
     */
    public function testGetPositions(
        User $user,
        string $categoryId,
        int $catalogId,
        int $localizedCatalogId,
        string $positions,
        array $expectedPositions,
        ?string $expectedError,
        int $expectedStatus
    ): void {
        $this->getPositions($user, $categoryId, $catalogId, $localizedCatalogId, $positions, $expectedPositions, $expectedError, $expectedStatus);
    }

    public function getPositions(
        ?User $user,
        string $categoryId,
        int $catalogId,
        int $localizedCatalogId,
        string $positions,
        array $expectedPositions,
        ?string $expectedError,
        int $expectedStatus
    ): void {
        $positions = addslashes($positions);

        if (null === $expectedError) {
            $this->validateApiCall(
                new RequestGraphQlToTest(
                    <<<GQL
                    mutation {
                      savePositionsCategoryProductMerchandising(input: {
                        categoryId: "$categoryId"
                        localizedCatalogId: $localizedCatalogId
                        catalogId: $catalogId
                        positions: "$positions"
                      }) {
                        categoryProductMerchandising {
                          id
                          result
                        }
                      }
                    }
                GQL,
                    $user,
                ),
                new ExpectedResponse(200)
            );
        }

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    query {
                        getPositionsCategoryProductMerchandising(categoryId:"{$categoryId}" localizedCatalogId:{$localizedCatalogId}) {
                            id
                            result
                        }
                    }
                GQL,
                $user,
            ),
            new ExpectedResponse(
                $expectedStatus,
                function (ResponseInterface $response) use ($expectedPositions, $expectedError) {
                    if (null !== $expectedError) {
                        $this->assertJsonContains([
                            'errors' => [
                                [
                                    'debugMessage' => $expectedError,
                                ],
                            ],
                        ]);
                    } else {
                        $this->assertJsonContains([
                            'data' => [
                                'getPositionsCategoryProductMerchandising' => [
                                    'id' => '/category_product_merchandisings/0',
                                ],
                            ],
                        ]);
                        $positionsFromResponse = $response->toArray()['data']['getPositionsCategoryProductMerchandising']['result'] ?? null;
                        $this->assertEquals($expectedPositions, json_decode($positionsFromResponse, true));
                    }
                }
            )
        );
    }

    public function getPositionsDataProvider(): array
    {
        $admin = $this->getUser(Role::ROLE_ADMIN);
        $categoryIdOne = 'one';
        $categoryIdTwo = 'two';
        $catalogIdB2c = 1;
        $localizedCatalogIdB2cFr = 1;
        $localizedCatalogIdB2cEn = 2;

        return [
            [
                $admin,
                'fake_category_id',
                $catalogIdB2c, // catalogId
                $localizedCatalogIdB2cFr, // localizedCatalogId
                '[]',
                [],
                'Category with id fake_category_id not found.',
                200,
            ],
            [
                $admin,
                'one',
                $catalogIdB2c, // catalogId
                999, // localizedCatalogId
                '[]',
                [],
                'Localized catalog with id 999 not found.',
                200,
            ],
            [
                $admin,
                $categoryIdOne,
                $catalogIdB2c, // catalogId
                $localizedCatalogIdB2cFr, // localizedCatalogId
                json_encode([['productId' => 1, 'position' => 1], ['productId' => 2, 'position' => 2]]),
                [['productId' => 1, 'position' => 1], ['productId' => 2, 'position' => 2]],
                null,
                200,
            ],
            [
                $admin,
                $categoryIdTwo,
                $catalogIdB2c, // catalogId
                $localizedCatalogIdB2cEn, // localizedCatalogId
                json_encode([['productId' => 1, 'position' => 20], ['productId' => 2, 'position' => 10]]),
                [['productId' => 2, 'position' => 10], ['productId' => 1, 'position' => 20]],
                null,
                200,
            ],
            [
                $admin,
                $categoryIdOne,
                $catalogIdB2c, // catalogId
                $localizedCatalogIdB2cFr, // localizedCatalogId
                json_encode([]),
                [],
                null,
                200,
            ],
            [
                $admin,
                $categoryIdTwo,
                $catalogIdB2c, // catalogId
                $localizedCatalogIdB2cEn, // localizedCatalogId
                json_encode([]),
                [],
                null,
                200,
            ],
        ];
    }
}
