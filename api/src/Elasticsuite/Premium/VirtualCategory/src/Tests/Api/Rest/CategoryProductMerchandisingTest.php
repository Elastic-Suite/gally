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

namespace Elasticsuite\VirtualCategory\Tests\Api\Rest;

use Elasticsuite\Category\Tests\Api\Rest\CategoryProductMerchandisingTest as BaseCategoryProductMerchandisingTest;
use Elasticsuite\User\Constant\Role;

class CategoryProductMerchandisingTest extends BaseCategoryProductMerchandisingTest
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::$subCategoryFields = array_merge(self::$subCategoryFields, ['is_virtual']);

        // Clear object not persisted in the parent class.
        $entityManager = static::getContainer()->get('doctrine')->getManager();
        $entityManager->clear();

        self::loadFixture([
            __DIR__ . '/../../fixtures/virtualCategoryPosition/catalogs.yaml',
            __DIR__ . '/../../fixtures/virtualCategoryPosition/categories.yaml',
            __DIR__ . '/../../fixtures/virtualCategoryPosition/source_field.yaml',
            __DIR__ . '/../../fixtures/virtualCategoryPosition/metadata.yaml',
            __DIR__ . '/../../fixtures/virtualCategoryPosition/configurations.yaml',
        ]);
        self::createEntityElasticsearchIndices('product');
        self::loadElasticsearchDocumentFixtures([__DIR__ . '/../../fixtures/virtualCategoryPosition/product_documents.json']);
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
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 100, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 3, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 100, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 3, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 100, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 11, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 21, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 3, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 101, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 201, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 11, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 21, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 50, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 51, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 101, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 201, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 11, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 21, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 50, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 51, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 50, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 51, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 11, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 21, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 3, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 3, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 11, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 21, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 3, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 3, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 3, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 4, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 100, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 100, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 1000, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2000, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 100, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 1000, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 2000, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => []],
                        $productId4 => [],
                    ],
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 100, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
                        $productId1 => [$categoryIdOne => ['position' => 100, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 200, 'is_virtual' => 'true'], $categoryIdTwo => []],
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
}
