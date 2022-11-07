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

use Elasticsuite\Category\Tests\Api\GraphQl\SyncCategoryProductMerchandisingDataTest as BaseSyncCategoryProductMerchandisingDataTest;

class SyncCategoryProductMerchandisingDataTest extends BaseSyncCategoryProductMerchandisingDataTest
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
            __DIR__ . '/../../fixtures/virtualCategoryPosition/product_merchandising_bulk.yaml',
        ]);
        self::createEntityElasticsearchIndices('product');
        self::loadElasticsearchDocumentFixtures([__DIR__ . '/../../fixtures/virtualCategoryPosition/product_documents_bulk.json']);
    }

    /**
     * @depends testInstallIndex
     */
    public function testDeleteIndex()
    {
        parent::testDeleteIndex();

        // Reset fixtures data.
        self::loadFixture([
            __DIR__ . '/../../fixtures/virtualCategoryPosition/catalogs.yaml',
            __DIR__ . '/../../fixtures/virtualCategoryPosition/categories.yaml',
            __DIR__ . '/../../fixtures/virtualCategoryPosition/source_field.yaml',
            __DIR__ . '/../../fixtures/virtualCategoryPosition/metadata.yaml',
            __DIR__ . '/../../fixtures/virtualCategoryPosition/configurations.yaml',
            __DIR__ . '/../../fixtures/virtualCategoryPosition/product_merchandising_bulk.yaml',
        ]);
        self::deleteElasticsearchFixtures();
        self::createEntityElasticsearchIndices('product');
    }

    /**
     * @dataProvider indexDataProvider
     * @depends testDeleteIndex
     */
    public function testBulkIndex(string $indexName, array $expectedPositions)
    {
        $documentsFile = __DIR__ . '/../../fixtures/virtualCategoryPosition/product_documents_bulk.json';
        $indices = file_get_contents(__DIR__ . '/../../fixtures/virtualCategoryPosition/product_documents_bulk.json');
        $indices = json_decode($indices, true);
        $this->validateBulkIndexData($indices, $documentsFile, $indexName, $expectedPositions);
    }

    public function indexDataProvider(): array
    {
        $productId1 = 1;
        $productId2 = 2;
        $productId3 = 3;
        $productId4 = 4;
        $categoryIdOne = 'one';
        $categoryIdTwo = 'two';
        $categoryIdThree = 'three';
        $categoryIdFive = 'five';
        $localizedCatalogIdB2cFr = 1;
        $localizedCatalogIdB2cEn = 2;
        $localizedCatalogIdb2bEn = 3;

        return [
            [
                'elasticsuite_b2c_fr_product',
                [
                    $localizedCatalogIdB2cFr => [
                        $productId1 => [$categoryIdOne => ['position' => 1, 'is_virtual' => 'true'], $categoryIdTwo => ['position' => 2]],
                        $productId2 => [$categoryIdOne => ['position' => 2, 'is_virtual' => 'true'], $categoryIdTwo => ['position' => 1]],
                        $productId3 => [$categoryIdThree => ['position' => 1]],
                        $productId4 => [],
                    ],
                ],
            ],
            [
                'elasticsuite_b2c_en_product',
                [
                    $localizedCatalogIdB2cEn => [
                        $productId1 => [$categoryIdOne => ['position' => 10, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId2 => [$categoryIdOne => ['position' => 20, 'is_virtual' => 'true'], $categoryIdTwo => []],
                        $productId3 => [$categoryIdThree => ['position' => 10]],
                        $productId4 => [],
                    ],
                ],
            ],
            [
                'elasticsuite_b2b_en_product',
                [
                    $localizedCatalogIdb2bEn => [
                        $productId1 => [$categoryIdTwo => []],
                        $productId2 => [$categoryIdTwo => []],
                        $productId3 => [],
                        $productId4 => [$categoryIdFive => ['position' => 100]],
                    ],
                ],
            ],
        ];
    }
}
