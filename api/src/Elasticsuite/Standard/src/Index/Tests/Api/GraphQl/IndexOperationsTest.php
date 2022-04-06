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

namespace Elasticsuite\Index\Tests\Api\GraphQl;

use Elasticsearch\Client;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Index\Api\IndexSettingsInterface;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;
use Elasticsuite\Standard\src\Test\AbstractTest;

class IndexOperationsTest extends AbstractTest
{
    private LocalizedCatalogRepository $catalogRepository;

    private static IndexRepositoryInterface $indexRepository;

    private IndexSettingsInterface $indexSettings;

    private Client $client;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        \assert(static::getContainer()->get(IndexRepositoryInterface::class) instanceof IndexRepositoryInterface);
        self::$indexRepository = static::getContainer()->get(IndexRepositoryInterface::class);
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->loadFixture([
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/catalogs.yaml',
        ]);
        $this->catalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);
        $this->indexSettings = static::getContainer()->get(IndexSettingsInterface::class);
        $this->client = static::getContainer()->get('api_platform.elasticsearch.client.test'); // @phpstan-ignore-line
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::$indexRepository->delete('test_elasticsuite*');
    }

    public function testCreateIndex(): void
    {
        $data = [];
        $catalogs = $this->catalogRepository->findAll();
        foreach ($catalogs as $catalog) {
            $data[] = [
                'product',
                (int) $catalog->getId(),
                "test_elasticsuite_{$catalog->getCode()}_product",
                ['.entity_product', ".catalog_{$catalog->getId()}"],
            ];
            $data[] = [
                'category',
                (int) $catalog->getId(),
                "test_elasticsuite_{$catalog->getCode()}_category",
                ['.entity_category', ".catalog_{$catalog->getId()}"],
            ];
        }

        foreach ($data as $datum) {
            [$entity, $catalogId, $expectedNamePrefix, $aliases] = $datum;
            $this->performCreateIndexTest($entity, $catalogId, $expectedNamePrefix, $aliases);
        }
    }

    /**
     * @depends testCreateIndex
     */
    public function testInstallIndex(): void
    {
        $data = [];
        $catalogs = $this->catalogRepository->findAll();
        foreach ($catalogs as $catalog) {
            $data[] = [
                "test_elasticsuite_{$catalog->getCode()}_product",
                "test_elasticsuite_{$catalog->getCode()}_product",
            ];
            $data[] = [
                "test_elasticsuite_{$catalog->getCode()}_category",
                "test_elasticsuite_{$catalog->getCode()}_category",
            ];
        }

        $installIndexSettings = $this->indexSettings->getInstallIndexSettings();
        foreach ($data as $datum) {
            [$indexNamePrefix, $installedIndexAlias] = $datum;
            $this->performInstallIndexTest($indexNamePrefix, $installedIndexAlias, $installIndexSettings);
        }
    }

    /**
     * @depends testInstallIndex
     */
    public function testRefreshIndex(): void
    {
        $data = [];
        $catalogs = $this->catalogRepository->findAll();
        foreach ($catalogs as $catalog) {
            $data[] = [
                "test_elasticsuite_{$catalog->getCode()}_product",
                "test_elasticsuite_{$catalog->getCode()}_product",
            ];
            $data[] = [
                "test_elasticsuite_{$catalog->getCode()}_category",
                "test_elasticsuite_{$catalog->getCode()}_category",
            ];
        }

        $installIndexSettings = $this->indexSettings->getInstallIndexSettings();
        foreach ($data as $datum) {
            [$indexNamePrefix, $installedIndexAlias] = $datum;
            $this->performRefreshIndexTest($indexNamePrefix, $installedIndexAlias);
        }
    }

    /**
     * @param string   $entityType         Entity type
     * @param int      $catalogId          Catalog ID
     * @param string   $expectedNamePrefix Expected index name prefix
     * @param string[] $expectedAliases    Expected index aliases
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     */
    protected function performCreateIndexTest(
        string $entityType,
        int $catalogId,
        string $expectedNamePrefix,
        array $expectedAliases
    ): void {
        $query = <<<GQL
            mutation {
              createIndex(input: {
                entityType: "{$entityType}",
                catalog: {$catalogId}
              }) {
                index {
                  id
                  name
                  aliases
                }
              }
            }
        GQL;

        $response = $this->requestGraphQl($query);
        $this->assertStringContainsString('"id":"\/indices\/' . $expectedNamePrefix, $response->getContent());
        $this->assertStringContainsString('"name":"' . $expectedNamePrefix, $response->getContent());
        $this->assertStringContainsString('"aliases":[', $response->getContent());
        foreach ($expectedAliases as $expectedAlias) {
            $this->assertStringContainsString('"' . $expectedAlias . '"', $response->getContent());
        }
    }

    /**
     * @param string       $indexNamePrefix             Index name prefix
     * @param string       $expectedInstalledIndexAlias Expected index alias when installed
     * @param array<mixed> $expectedIndexSettings       Expected index settings
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     */
    protected function performInstallIndexTest(
        string $indexNamePrefix,
        string $expectedInstalledIndexAlias,
        array $expectedIndexSettings
    ): void {
        $index = self::$indexRepository->findByName("{$indexNamePrefix}*");
        $this->assertNotNull($index);
        $this->assertInstanceOf(Index::class, $index);

        $query = <<<GQL
            mutation {
              installIndex(input: {
                name: "{$index->getName()}"
              }) {
                index {
                  id
                  name
                  aliases
                }
              }
            }
        GQL;
        $response = $this->requestGraphQl($query);
        $responseData = $response->toArray();

        // Check that the index has the install index.
        $this->assertNotEmpty($responseData['data']['installIndex']['index']['aliases']);
        $this->assertContains($expectedInstalledIndexAlias, $responseData['data']['installIndex']['index']['aliases']);

        // Check that the index has the proper installed index settings.
        $settings = $this->client->indices()->getSettings(['index' => $index->getName()]);
        $this->assertNotEmpty($settings[$index->getName()]['settings']['index']);
        $this->assertArraySubset($expectedIndexSettings, $settings[$index->getName()]['settings']['index']);
    }

    protected function performRefreshIndexTest(
        string $indexNamePrefix,
        string $expectedInstalledIndexAlias
    ): void {
        $index = self::$indexRepository->findByName("{$indexNamePrefix}*");
        $this->assertNotNull($index);
        $this->assertInstanceOf(Index::class, $index);

        $initialRefreshCount = $this->getRefreshCount($index->getName());

        $query = <<<GQL
            mutation {
              refreshIndex(input: {
                name: "{$index->getName()}"
              }) {
                index {
                  id
                  name
                  aliases
                }
              }
            }
        GQL;
        $response = $this->requestGraphQl($query);
        $responseData = $response->toArray();

        // Check that the index still has the install index.
        // TODO re-instate tests on aliases when the read stage is correctly performed based on name.
        // $this->assertNotEmpty($responseData['data']['refreshIndex']['index']['aliases']);
        // $this->assertContains($expectedInstalledIndexAlias, $responseData['data']['refreshIndex']['index']['aliases']);

        $refreshCount = $this->getRefreshCount($index->getName());

        $this->assertGreaterThan($initialRefreshCount, $refreshCount);
    }

    protected function getRefreshCount(string $indexName): int
    {
        $refreshMetrics = $this->client->indices()->stats(['index' => $indexName, 'metric' => 'refresh']);
        $this->assertNotEmpty($refreshMetrics);
        $this->assertArrayHasKey('_all', $refreshMetrics);
        $this->assertArrayHasKey('primaries', $refreshMetrics['_all']);
        $this->assertArrayHasKey('refresh', $refreshMetrics['_all']['primaries']);
        $this->assertArrayHasKey('external_total', $refreshMetrics['_all']['primaries']['refresh']);

        return $refreshMetrics['_all']['primaries']['refresh']['external_total'];
    }
}
