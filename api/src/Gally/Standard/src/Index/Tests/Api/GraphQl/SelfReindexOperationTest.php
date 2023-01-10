<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Gally\Index\Tests\Api\GraphQl;

use Gally\Catalog\Repository\LocalizedCatalogRepository;
use Gally\Index\Api\IndexSettingsInterface;
use Gally\Index\Model\Index;
use Gally\Index\Model\Index\SelfReindex;
use Gally\Index\Repository\Index\IndexRepositoryInterface;
use Gally\Test\AbstractTest;
use Gally\Test\ExpectedResponse;
use Gally\Test\RequestGraphQlToTest;
use Gally\User\Constant\Role;
use Gally\User\Model\User;
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
        self::$indexSettings = static::getContainer()->get('Gally\Index\Service\IndexSettingsTest'); // @phpstan-ignore-line
        self::loadFixture([
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
        ]);
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::$indexRepository->delete('gally_test__gally_*');
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
     * @param array   $expectedErrorData    Expected error data (empty if success)
     * @param array   $expectedEntityTypes  Expected impacted entity types
     */
    public function testPerformSelfReindex(
        User $user,
        ?string $entityType,
        int $expectedIndicesCount,
        array $expectedErrorData,
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
            new RequestGraphQlToTest(
                <<<GQL
                    mutation {
                      performSelfReindex (input: {entityType: "{$entityType}"}) {
                        selfReindex {
                          id
                          _id
                          status
                          entityTypes
                          indexNames
                        }
                      }
                    }
                GQL,
                $user,
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use (
                    $expectedIndicesCount,
                    $expectedErrorData,
                    $expectedEntityTypes,
                    $installedEntityIndicesNames,
                    $indexRepository,
                    $indexSettings
                ) {
                    if (!empty($expectedErrorData)) {
                        $this->assertJsonContains($expectedErrorData);
                    } else {
                        $this->assertMatchesJsonSchema([
                            'type' => 'object',
                            'properties' => [
                                'data' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'performSelfReindex' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'selfReindex' => [
                                                    'type' => 'object',
                                                    'properties' => [
                                                        'id' => [
                                                            'type' => 'string',
                                                            'format' => 'uri-reference',
                                                            'pattern' => '^\/indices\/self-reindex\?id=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
                                                        ],
                                                        '_id' => [
                                                            'type' => 'string',
                                                            'format' => 'uid',
                                                        ],
                                                        'status' => [
                                                            'type' => 'string',
                                                            'enum' => [SelfReindex::STATUS_SUCCESS],
                                                        ],
                                                        'entityTypes' => [
                                                            'type' => 'array',
                                                            'items' => [
                                                                'type' => 'string',
                                                                'enum' => $expectedEntityTypes,
                                                            ],
                                                        ],
                                                        'indexNames' => [
                                                            'type' => 'array',
                                                            'items' => [
                                                                'type' => 'string',
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
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
                        $installedEntityIndicesNames = $responseData['data']['performSelfReindex']['selfReindex']['indexNames'];
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
                }
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
            ['errors' => [['debugMessage' => 'Access Denied.']]],
            [],
        ];

        $localizedCatalogsCount = $catalogRepository->count([]);
        $expectedIndicesCount = $initialIndicesCount;
        yield [
            $admin,
            'product',
            $expectedIndicesCount + $localizedCatalogsCount,
            [],
            ['product'],
        ];

        yield [
            $admin,
            'missing-entity',
            $expectedIndicesCount + $localizedCatalogsCount,
            [
                'errors' => [[
                    'debugMessage' => 'Entity type [missing-entity] does not exist',
                    'message' => 'Internal server error',
                ]],
            ],
            [],
        ];

        yield [
            $admin,
            'category',
            $expectedIndicesCount + (2 * $localizedCatalogsCount),
            [],
            ['category'],
        ];

        yield [
            $admin,
            '',
            $expectedIndicesCount + (2 * $localizedCatalogsCount),
            [],
            ['product', 'category'],
        ];

        yield [
            $admin,
            null,
            $expectedIndicesCount + (2 * $localizedCatalogsCount),
            [],
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
