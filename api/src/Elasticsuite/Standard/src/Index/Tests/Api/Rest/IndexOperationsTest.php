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

namespace Elasticsuite\Index\Tests\Api\Rest;

use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;
use Elasticsuite\Standard\src\Test\AbstractEntityTest;

class IndexOperationsTest extends AbstractEntityTest
{
    private static IndexRepositoryInterface $indexRepository;

    private static int $initialIndicesCount;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        \assert(static::getContainer()->get(IndexRepositoryInterface::class) instanceof IndexRepositoryInterface);
        self::$indexRepository = static::getContainer()->get(IndexRepositoryInterface::class);
        self::$initialIndicesCount = \count(self::$indexRepository->findAll());
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::$indexRepository->delete('test_elasticsuite*');
    }

    /**
     * This method is called before the first test of this test class is run.
     */
    protected function getEntityClass(): string
    {
        return Index::class;
    }

    protected function getApiPath(): string
    {
        return '/indices';
    }

    protected function getFixtureFiles(): array
    {
        return [
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/catalogs.yaml',
        ];
    }

    protected function getJsonCreationValidation(array $validData): array
    {
        return [
            '@context' => '/contexts/Index',
            '@type' => 'Index',
            'aliases' => [
                '.catalog_' . $validData['catalog'],
                '.entity_' . $validData['entityType'],
            ],
        ];
    }

    protected function getJsonCollectionValidation(): array
    {
        return [
            '@context' => '/contexts/Index',
            '@id' => '/indices',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => self::$initialIndicesCount + 6,
        ];
    }

    public function validDataProvider(): array
    {
        $data = [];

        $catalogs = [
            1 => 'b2c_fr',
            2 => 'b2c_en',
            3 => 'b2b_en',
        ];
        foreach ($catalogs as $catalogId => $catalogCode) {
            $data[] = [
                ['entityType' => 'product', 'catalog' => $catalogId],
                "#^{$this->getApiPath()}/test_elasticsuite_{$catalogCode}_product_[0-9]{8}_[0-9]{6}$#",
            ];
            $data[] = [
                ['entityType' => 'category', 'catalog' => $catalogId],
                "#^{$this->getApiPath()}/test_elasticsuite_{$catalogCode}_category_[0-9]{8}_[0-9]{6}$#",
            ];
        }

        return $data;
    }

    public function invalidDataProvider(): array
    {
        return [
            [['entityType' => 'string', 'catalog' => 0], 'Entity type [string] does not exist', 400],
            [['entityType' => 'product', 'catalog' => 0], 'Catalog of ID [0] does not exist', 400],
            [['entityType' => 'category', 'catalog' => 0], 'Catalog of ID [0] does not exist', 400],
        ];
    }
}
