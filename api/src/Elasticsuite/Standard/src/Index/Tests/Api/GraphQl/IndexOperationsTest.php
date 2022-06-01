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
use Elasticsuite\Standard\src\Test\ExpectedResponse;
use Elasticsuite\Standard\src\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Elasticsuite\User\Model\User;
use Symfony\Contracts\HttpClient\ResponseInterface;

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
        self::loadFixture([
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/catalogs.yaml',
        ]);
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->indexSettings = static::getContainer()->get(IndexSettingsInterface::class);
        $this->client = static::getContainer()->get('api_platform.elasticsearch.client.test'); // @phpstan-ignore-line
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::$indexRepository->delete('elasticsuite_test__elasticsuite_*');
    }

    /**
     * @dataProvider createIndexDataProvider
     */
    public function testCreateIndex(User $user, string $entityType, int $catalogId, array $expectedData): void
    {
        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
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
                GQL,
                $user,
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($expectedData) {
                    if (isset($expectedData['errors'])) {
                        $this->assertJsonContains($expectedData);
                    } else {
                        $this->assertStringContainsString('"id":"\/indices\/' . $expectedData['name'], $response->getContent());
                        $this->assertStringContainsString('"name":"' . $expectedData['name'], $response->getContent());
                        $this->assertStringContainsString('"aliases":[', $response->getContent());
                        foreach ($expectedData['aliases'] as $expectedAlias) {
                            $this->assertStringContainsString('"' . $expectedAlias . '"', $response->getContent());
                        }
                    }
                }
            )
        );
    }

    public function createIndexDataProvider(): iterable
    {
        self::loadFixture([
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/catalogs.yaml',
        ]);
        $this->catalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);
        $admin = $this->getUser(Role::ROLE_ADMIN);

        yield [
            $this->getUser(Role::ROLE_CONTRIBUTOR),
            'product',
            1,
            ['errors' => [['debugMessage' => 'Access Denied.']]],
        ];

        foreach ($this->catalogRepository->findAll() as $catalog) {
            yield [
                $admin,
                'product',
                (int) $catalog->getId(),
                [
                    'name' => "elasticsuite_test__elasticsuite_{$catalog->getCode()}_product",
                    'aliases' => ['.entity_product', ".catalog_{$catalog->getId()}"],
                ],
            ];
            yield [
                $admin,
                'category',
                (int) $catalog->getId(),
                [
                    'name' => "elasticsuite_test__elasticsuite_{$catalog->getCode()}_category",
                    'aliases' => ['.entity_category', ".catalog_{$catalog->getId()}"],
                ],
            ];
        }
    }

    /**
     * @depends testCreateIndex
     * @dataProvider installIndexDataProvider
     */
    public function testInstallIndex(User $user, string $indexNamePrefix, array $expectedData): void
    {
        $installIndexSettings = $this->indexSettings->getInstallIndexSettings();
        $index = self::$indexRepository->findByName("{$indexNamePrefix}*");
        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
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
                GQL,
                $user,
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($index, $expectedData, $installIndexSettings) {
                    if (isset($expectedData['errors'])) {
                        $this->assertJsonContains($expectedData);
                    } else {
                        $responseData = $response->toArray();

                        // Check that the index has the install index.
                        $this->assertNotEmpty($responseData['data']['installIndex']['index']['aliases']);
                        $this->assertContains($expectedData['alias'], $responseData['data']['installIndex']['index']['aliases']);

                        // Check that the index has the proper installed index settings.
                        $settings = $this->client->indices()->getSettings(['index' => $index->getName()]);
                        $this->assertNotEmpty($settings[$index->getName()]['settings']['index']);
                        $this->assertArraySubset($installIndexSettings, $settings[$index->getName()]['settings']['index']);
                    }
                }
            )
        );
    }

    public function installIndexDataProvider(): iterable
    {
        self::loadFixture([
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/catalogs.yaml',
        ]);
        $this->catalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);
        $admin = $this->getUser(Role::ROLE_ADMIN);

        yield [
            $this->getUser(Role::ROLE_CONTRIBUTOR),
            'elasticsuite_test__elasticsuite_b2c_fr_product',
            ['errors' => [['debugMessage' => 'Access Denied.']]],
        ];

        foreach ($this->catalogRepository->findAll() as $catalog) {
            yield [
                $admin,
                "elasticsuite_test__elasticsuite_{$catalog->getCode()}_product",
                ['alias' => "elasticsuite_test__elasticsuite_{$catalog->getCode()}_product"],
            ];
            yield [
                $admin,
                "elasticsuite_test__elasticsuite_{$catalog->getCode()}_category",
                ['alias' => "elasticsuite_test__elasticsuite_{$catalog->getCode()}_category"],
            ];
        }
    }

    /**
     * @depends testInstallIndex
     * @dataProvider installIndexDataProvider
     */
    public function testRefreshIndex(User $user, string $indexNamePrefix, array $expectedData): void
    {
        $index = self::$indexRepository->findByName("{$indexNamePrefix}*");
        $initialRefreshCount = $this->getRefreshCount($index->getName());

        $this->assertNotNull($index);
        $this->assertInstanceOf(Index::class, $index);
        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
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
                GQL,
                $user,
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($index, $expectedData, $initialRefreshCount) {
                    if (isset($expectedData['errors'])) {
                        $this->assertJsonContains($expectedData);
                    } else {
                        // Check that the index still has the install index.
                        // TODO re-instate tests on aliases when the read stage is correctly performed based on name.
                        // $this->assertNotEmpty($responseData['data']['refreshIndex']['index']['aliases']);
                        // $this->assertContains($expectedInstalledIndexAlias, $responseData['data']['refreshIndex']['index']['aliases']);

                        $refreshCount = $this->getRefreshCount($index->getName());
                        $this->assertGreaterThan($initialRefreshCount, $refreshCount);
                    }
                }
            )
        );
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
