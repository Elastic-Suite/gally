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

namespace Elasticsuite\Index\Tests\Api\Rest;

use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Index\Api\IndexSettingsInterface;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\Model\Index\SelfReindex;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;
use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestToTest;
use Elasticsuite\User\Constant\Role;
use Elasticsuite\User\Model\User;
use Symfony\Contracts\HttpClient\ResponseInterface;

class SelfReindexOperationTest extends AbstractTest
{
    private static IndexRepositoryInterface $indexRepository;

    private static IndexSettingsInterface $indexSettings;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        \assert(static::getContainer()->get(IndexRepositoryInterface::class) instanceof IndexRepositoryInterface);
        self::$indexRepository = static::getContainer()->get(IndexRepositoryInterface::class);
        self::$indexSettings = static::getContainer()->get('Elasticsuite\Index\Service\IndexSettingsTest'); // @phpstan-ignore-line
        self::loadFixture([
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
        ]);
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::$indexRepository->delete('elasticsuite_test__elasticsuite_*');
    }

    /**
     * @dataProvider performSelfReindexDataProvider
     *
     * Tests "All or nothing" behavior:
     * - either it fails because of authorization or data input and no index is changed
     * - or it succeeds for all entity indices
     * Partial success is out of the scope of this test.
     *
     * @param User    $user                 API user for which to perform the call
     * @param ?string $entityType           Optional entity type for which to rebuild indices (if empty, all entities)
     * @param int     $expectedIndicesCount Expected global indices count after the API call (wether it succeeds or not)
     * @param int     $expectedHttpCode     Expected HTTP response code
     * @param ?string $expectedErrorMessage Expected error message, if any
     * @param array   $expectedEntityTypes  Expected impacted entity types
     */
    public function testPerformSelfReindex(
        User $user,
        ?string $entityType,
        int $expectedIndicesCount,
        int $expectedHttpCode,
        ?string $expectedErrorMessage,
        array $expectedEntityTypes,
    ): void {
        $indexRepository = self::$indexRepository;
        $indexSettings = self::$indexSettings;
        // Installed entity indices *before* initiating the reindex.
        $installedEntityIndicesNames = array_map(
            function (Index $index) { return $index->getName(); },
            $this->getInstalledEntityIndices($expectedEntityTypes, $indexRepository, $indexSettings)
        );

        $this->validateApiCall(
            new RequestToTest(
                'POST',
                '/indices/self-reindex',
                $user,
                ['entityType' => "{$entityType}"]
            ),
            new ExpectedResponse(
                $expectedHttpCode,
                function (ResponseInterface $response) use (
                    $expectedIndicesCount,
                    $expectedErrorMessage,
                    $expectedEntityTypes,
                    $installedEntityIndicesNames,
                    $indexRepository,
                    $indexSettings
                ) {
                    if (empty($expectedErrorMessage)) {
                        $this->assertMatchesJsonSchema([
                            'type' => 'object',
                            'properties' => [
                                '@context' => [
                                    'type' => 'string',
                                    'format' => 'uri-reference',
                                    'enum' => ['/contexts/SelfReindex'],
                                ],
                                '@id' => [
                                    'type' => 'string',
                                    'format' => 'uri-reference',
                                    'pattern' => '^\/indices\/self-reindex\?id=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
                                ],
                                '@type' => [
                                    'type' => 'string',
                                    'enum' => ['SelfReindex'],
                                ],
                                'id' => [
                                    'type' => 'string',
                                    'format' => 'uid',
                                ],
                                'entityTypes' => [
                                    'type' => 'array',
                                    'items' => [
                                        'type' => 'string',
                                        'enum' => $expectedEntityTypes,
                                    ],
                                ],
                                'status' => [
                                    'type' => 'string',
                                    'enum' => [SelfReindex::STATUS_SUCCESS],
                                ],
                                'indexNames' => [
                                    'type' => 'array',
                                    'items' => [
                                        'type' => 'string',
                                    ],
                                ],
                            ],
                        ]);

                        // Make sure all previously installed entity indices have been deleted.
                        foreach ($installedEntityIndicesNames as $installedEntityIndexName) {
                            $this->assertNull($indexRepository->findByName($installedEntityIndexName));
                        }

                        // Initiate the test below that all new indices are installed.
                        $responseData = json_decode($response->getContent(), true);
                        $installedEntityIndicesNames = $responseData['indexNames'];
                    }

                    /*
                     * Make sure
                     * - either all previously installed entity indices have been kept as is (in case of error)
                     * - or that all newly created entity indices are installed
                     */
                    foreach ($installedEntityIndicesNames as $installedEntityIndexName) {
                        $index = $indexRepository->findByName($installedEntityIndexName);
                        $this->assertNotNull($index);
                        $this->assertInstanceOf(Index::class, $index);
                        $this->assertTrue($indexSettings->isInternal($index)); // belt + suspenders, as it is covered by isInstalled.
                        $this->assertTrue($indexSettings->isInstalled($index));
                    }

                    $this->assertCount($expectedIndicesCount, $indexRepository->findAll());
                },
                $expectedErrorMessage,
                true
            )
        );
    }

    public function performSelfReindexDataProvider(): iterable
    {
        self::loadFixture([
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/catalogs.yaml',
        ]);
        $catalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);
        $indexRepository = static::getContainer()->get(IndexRepositoryInterface::class);
        $initialIndicesCount = \count($indexRepository->findAll());

        $admin = $this->getUser(Role::ROLE_ADMIN);

        yield [
            $this->getUser(Role::ROLE_CONTRIBUTOR),
            'product',
            $initialIndicesCount,
            403,
            'Access Denied.',
            [],
        ];

        $localizedCatalogsCount = $catalogRepository->count([]);
        $expectedIndicesCount = $initialIndicesCount;
        yield [
            $admin,
            'product',
            $expectedIndicesCount + $localizedCatalogsCount,
            201,
            null,
            ['product'],
        ];

        yield [
            $admin,
            'missing-entity',
            $expectedIndicesCount + $localizedCatalogsCount,
            400,
            'Entity type [missing-entity] does not exist',
            [],
        ];

        yield [
            $admin,
            'category',
            $expectedIndicesCount + (2 * $localizedCatalogsCount),
            201,
            null,
            ['category'],
        ];

        yield [
            $admin,
            '',
            $expectedIndicesCount + (2 * $localizedCatalogsCount),
            201,
            null,
            ['product', 'category'],
        ];

        yield [
            $admin,
            null,
            $expectedIndicesCount + (2 * $localizedCatalogsCount),
            201,
            null,
            ['product', 'category'],
        ];
    }

    /**
     * Provided the list of internal and installed entity indices for a list of provided entities.
     *
     * @param array                    $entities        Entities
     * @param IndexRepositoryInterface $indexRepository Index repository
     * @param IndexSettingsInterface   $indexSettings   Index settings
     *
     * @return Index[]
     */
    private function getInstalledEntityIndices(array $entities, IndexRepositoryInterface $indexRepository, IndexSettingsInterface $indexSettings): array
    {
        return array_filter(
            $indexRepository->findAll(),
            function (Index $index) use ($indexSettings, $entities) {
                return \in_array($index->getEntityType(), $entities, true)
                    && $indexSettings->isInternal($index) // belt + suspenders, as it is covered by isInstalled.
                    && $indexSettings->isInstalled($index);
            }
        );
    }
}
