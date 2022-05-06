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
use Elasticsuite\Fixture\Service\ElasticsearchFixturesInterface;
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

        self::loadElasticsearchIndexFixtures([__DIR__ . '/../../fixtures/indices.json']);
        self::loadElasticsearchDocumentFixtures([__DIR__ . '/../../fixtures/documents.json']);
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::$indexRepository->delete('elasticsuite_test__elasticsuite_*');
        self::deleteElasticsearchFixtures();
    }

    /**
     * This method is called before the first test of this test class is run.
     */
    protected function getEntityClass(): string
    {
        return Index::class;
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
            'aliases' => [
                '.catalog_' . $validData['catalog'],
                '.entity_' . $validData['entityType'],
            ],
        ];
    }

    protected function getJsonGetValidation(array $expectedData): array
    {
        unset($expectedData['id']);

        return $expectedData;
    }

    protected function getJsonGetCollectionValidation(): array
    {
        return [
            'hydra:totalItems' => self::$initialIndicesCount + 11,
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
                "#^{$this->getApiPath()}/elasticsuite_test__elasticsuite_{$catalogCode}_product_[0-9]{8}_[0-9]{6}$#",
            ];
            $data[] = [
                ['entityType' => 'category', 'catalog' => $catalogId],
                "#^{$this->getApiPath()}/elasticsuite_test__elasticsuite_{$catalogCode}_category_[0-9]{8}_[0-9]{6}$#",
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
            ['wrong_id', [], 404],
            [
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_fr_product_20220429_153000',
                [
                    'id' => ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_fr_product_20220429_153000',
                    'name' => ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_fr_product_20220429_153000',
                    'aliases' => [],
                    'docsCount' => 2,
                    'entityType' => 'product',
                    'catalog' => '/localized_catalogs/4',
                    'status' => 'indexing',
                    'mapping' => [
                        'properties' => [
                            'entity_id' => [
                                'type' => 'text',
                                'fields' => [
                                    'keyword' => [
                                        'type' => 'keyword',
                                        'ignore_above' => 256,
                                    ],
                                ],
                            ],
                            'name' => [
                                'type' => 'text',
                            ],
                            'size' => [
                                'type' => 'integer',
                            ],
                            'sku' => [
                                'type' => 'text',
                                'fields' => [
                                    'keyword' => [
                                        'type' => 'keyword',
                                        'ignore_above' => 256,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'settings' => [
                        'index' => [
                            'routing' => [
                                'allocation' => [
                                    'include' => [
                                        '_tier_preference' => 'data_content',
                                    ],
                                ],
                            ],
                            'number_of_shards' => '1',
                            'number_of_replicas' => '1',
                        ],
                    ],
                ],
                200,
            ],
            [
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_fr_category_20220429_173000',
                [
                    'id' => ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_fr_category_20220429_173000',
                    'name' => ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_fr_category_20220429_173000',
                    'aliases' => [],
                    'docsCount' => 0,
                    'entityType' => 'category',
                    'catalog' => '/localized_catalogs/4',
                    'status' => 'live',
                    'mapping' => [
                        'properties' => [
                            'name' => [
                                'type' => 'text',
                            ],
                            'parent' => [
                                'type' => 'text',
                            ],
                        ],
                    ],
                    'settings' => [
                        'index' => [
                            'routing' => [
                                'allocation' => [
                                    'include' => [
                                        '_tier_preference' => 'data_content',
                                    ],
                                ],
                            ],
                            'number_of_shards' => '1',
                            'number_of_replicas' => '1',
                        ],
                    ],
                ],
                200,
            ],
            [
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_fr_category_20210429_173000',
                [
                    'id' => ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_fr_category_20210429_173000',
                    'name' => ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_fr_category_20210429_173000',
                    'aliases' => [],
                    'docsCount' => 0,
                    'entityType' => 'category',
                    'catalog' => '/localized_catalogs/4',
                    'status' => 'ghost',
                    'mapping' => [
                        'properties' => [
                            'name' => [
                                'type' => 'text',
                            ],
                            'parent' => [
                                'type' => 'text',
                            ],
                        ],
                    ],
                    'settings' => [
                        'index' => [
                            'routing' => [
                                'allocation' => [
                                    'include' => [
                                        '_tier_preference' => 'data_content',
                                    ],
                                ],
                            ],
                            'number_of_shards' => '1',
                            'number_of_replicas' => '1',
                        ],
                    ],
                ],
                200,
            ],
            [
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_fr_category_20220429_000000',
                [
                    'id' => ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_fr_category_20220429_000000',
                    'name' => ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_fr_category_20220429_000000',
                    'aliases' => [],
                    'docsCount' => 0,
                    'entityType' => 'category',
                    'catalog' => null,
                    'status' => 'invalid',
                    'mapping' => [
                        'properties' => [
                            'name' => [
                                'type' => 'text',
                            ],
                            'parent' => [
                                'type' => 'text',
                            ],
                        ],
                    ],
                    'settings' => [
                        'index' => [
                            'routing' => [
                                'allocation' => [
                                    'include' => [
                                        '_tier_preference' => 'data_content',
                                    ],
                                ],
                            ],
                            'number_of_shards' => '1',
                            'number_of_replicas' => '1',
                        ],
                    ],
                ],
                200,
            ],
            [
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'test',
                [
                    'id' => ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'test',
                    'name' => ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'test',
                    'aliases' => [],
                    'docsCount' => 0,
                    'entityType' => null,
                    'catalog' => null,
                    'status' => 'external',
                    'mapping' => [
                        'properties' => [
                            'name' => [
                                'type' => 'text',
                            ],
                        ],
                    ],
                    'settings' => [
                        'index' => [
                            'routing' => [
                                'allocation' => [
                                    'include' => [
                                        '_tier_preference' => 'data_content',
                                    ],
                                ],
                            ],
                            'number_of_shards' => '1',
                            'number_of_replicas' => '1',
                        ],
                    ],
                ],
                200,
            ],
        ];
    }

    public function deleteDataProvider(): array
    {
        return [
            [ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_fr_product_20220429_153000', 200],
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
                "elasticsuite_test__elasticsuite_{$catalogCode}_product",
                "elasticsuite_test__elasticsuite_{$catalogCode}_product",
            ];
            $data[] = [
                "elasticsuite_test__elasticsuite_{$catalogCode}_category",
                "elasticsuite_test__elasticsuite_{$catalogCode}_category",
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
