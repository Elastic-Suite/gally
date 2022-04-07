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

use Elasticsearch\Client;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;
use Elasticsuite\Standard\src\Test\AbstractEntityTest;

class IndexOperationsTest extends AbstractEntityTest
{
    private static IndexRepositoryInterface $indexRepository;

    private static int $initialIndicesCount;

    private static Client $elasticsearchClient;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        \assert(static::getContainer()->get(IndexRepositoryInterface::class) instanceof IndexRepositoryInterface);
        self::$indexRepository = static::getContainer()->get(IndexRepositoryInterface::class);
        self::$initialIndicesCount = \count(self::$indexRepository->findAll());
        self::$elasticsearchClient = static::getContainer()->get('api_platform.elasticsearch.client.test'); // @phpstan-ignore-line
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

    protected static function getFixtureFiles(): array
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

    protected function getJsonGetValidation(array $expectedData): array
    {
        return [
            '@context' => '/contexts/Index',
            '@id' => '/indices/' . $expectedData['id'],
            '@type' => 'Index',
        ];
    }

    protected function getJsonGetCollectionValidation(): array
    {
        return [
            '@context' => '/contexts/Index',
            '@id' => '/indices',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => self::$initialIndicesCount + 6,
        ];
    }

    public function createValidDataProvider(): array
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

    public function createInvalidDataProvider(): array
    {
        return [
            [['entityType' => 'string', 'catalog' => 0], 'Entity type [string] does not exist', 400],
            [['entityType' => 'product', 'catalog' => 0], 'Catalog of ID [0] does not exist', 400],
            [['entityType' => 'category', 'catalog' => 0], 'Catalog of ID [0] does not exist', 400],
        ];
    }

    public function getDataProvider(): array
    {
        return [
            // Todo: How to get index name ?
            ['wrong_id', [], 404],
        ];
    }

    public function deleteDataProvider(): array
    {
        return [
            // Todo: How to get index name ?
            ['wrong_id', 404],
        ];
    }

    /**
     * @dataProvider installOrRefreshIndexDataProvider
     * @depends testCreateValidData
     *
     * @param string $indexNamePrefix             Index name prefix
     * @param string $expectedInstalledIndexAlias Expected installed index alias
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     */
    public function testInstallIndex(string $indexNamePrefix, string $expectedInstalledIndexAlias): void
    {
        $index = self::$indexRepository->findByName("{$indexNamePrefix}*");
        $this->assertNotNull($index);
        $this->assertInstanceOf(Index::class, $index);

        $this->requestRest('PUT', "/indices/install/{$index->getName()}");
        $this->assertResponseStatusCodeSame(200);
        $this->assertJsonContains([
            '@context' => '/contexts/Index',
            '@id' => "/indices/{$index->getName()}",
            '@type' => 'Index',
            'name' => $index->getName(),
            // TODO re-instate tests on aliases when the read stage is correctly performed based on name.
        ]);
    }

    /**
     * @dataProvider installOrRefreshIndexDataProvider
     * @depends testCreateValidData
     *
     * @param string $indexNamePrefix             Index name prefix
     * @param string $expectedInstalledIndexAlias Expected installed index alias
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     */
    public function testRefreshIndex(string $indexNamePrefix, string $expectedInstalledIndexAlias): void
    {
        $index = self::$indexRepository->findByName("{$indexNamePrefix}*");
        $this->assertNotNull($index);
        $this->assertInstanceOf(Index::class, $index);

        $initialRefreshCount = $this->getRefreshCount($index->getName());

        $this->requestRest('PUT', "/indices/refresh/{$index->getName()}");
        $this->assertResponseStatusCodeSame(200);
        $this->assertJsonContains([
            '@context' => '/contexts/Index',
            '@id' => "/indices/{$index->getName()}",
            '@type' => 'Index',
            'name' => $index->getName(),
            // TODO re-instate when the read stage is correctly performed based on name.
        ]);

        $refreshCount = $this->getRefreshCount($index->getName());
        $this->assertGreaterThan($initialRefreshCount, $refreshCount);
    }

    public function installOrRefreshIndexDataProvider(): array
    {
        $data = [];

        $catalogs = [
            1 => 'b2c_fr',
            2 => 'b2c_en',
            3 => 'b2b_en',
        ];
        foreach ($catalogs as $catalogId => $catalogCode) {
            $data[] = [
                "test_elasticsuite_{$catalogCode}_product",
                "test_elasticsuite_{$catalogCode}_product",
            ];
            $data[] = [
                "test_elasticsuite_{$catalogCode}_category",
                "test_elasticsuite_{$catalogCode}_category",
            ];
        }

        return $data;
    }

    protected function getRefreshCount(string $indexName): int
    {
        $refreshMetrics = self::$elasticsearchClient->indices()->stats(['index' => $indexName, 'metric' => 'refresh']);
        $this->assertNotEmpty($refreshMetrics);
        $this->assertArrayHasKey('_all', $refreshMetrics);
        $this->assertArrayHasKey('primaries', $refreshMetrics['_all']);
        $this->assertArrayHasKey('refresh', $refreshMetrics['_all']['primaries']);
        $this->assertArrayHasKey('external_total', $refreshMetrics['_all']['primaries']['refresh']);

        return $refreshMetrics['_all']['primaries']['refresh']['external_total'];
    }
}
