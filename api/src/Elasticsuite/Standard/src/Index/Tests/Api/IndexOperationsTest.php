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

namespace Elasticsuite\Index\Tests\Api;

use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;

class IndexOperationsTest extends AbstractTest
{
    private LocalizedCatalogRepository $catalogRepository;

    private IndexRepositoryInterface $indexRepository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->loadFixture([
            __DIR__ . '/../fixtures/metadata.yaml',
            __DIR__ . '/../fixtures/catalogs.yaml',
        ]);
        $this->catalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);
        $this->indexRepository = static::getContainer()->get(IndexRepositoryInterface::class);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        $this->indexRepository->delete('test_elasticsuite*');
    }

    public function testCreateIndex(): void
    {
        $data = [];
        $catalogs = $this->catalogRepository->findAll();
        foreach ($catalogs as $catalog) {
            $data[] = [
                'product', (int) $catalog->getId(), "test_elasticsuite_{$catalog->getCode()}_product",
            ];
            $data[] = [
                'category', (int) $catalog->getId(), "test_elasticsuite_{$catalog->getCode()}_category",
            ];
        }

        foreach ($data as $datum) {
            [$entity, $catalogId, $expectedNamePrefix] = $datum;
            $this->performCreateIndexTest($entity, $catalogId, $expectedNamePrefix);
        }
    }

    protected function performCreateIndexTest(string $entityType, int $catalogId, string $expectedNamePrefix): void
    {
        $query = <<<GQL
            mutation {
              createIndex(input: {
                entityType: "{$entityType}",
                catalog: {$catalogId}
              }) {
                index {
                  id
                  name
                  alias
                }
              }
            }
        GQL;

        $response = $this->requestGraphQl($query);
        $this->assertStringContainsString('"id":"\/indices\/' . $expectedNamePrefix, $response->getContent());
        $this->assertStringContainsString('"name":"' . $expectedNamePrefix, $response->getContent());
        $this->assertStringContainsString('"alias":""', $response->getContent());
    }
}
