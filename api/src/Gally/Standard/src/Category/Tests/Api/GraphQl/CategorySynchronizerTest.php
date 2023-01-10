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

namespace Gally\Category\Tests\Api\GraphQl;

use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use Gally\Catalog\Model\Catalog;
use Gally\Catalog\Repository\LocalizedCatalogRepository;
use Gally\Category\Decoration\SyncCategoryDataAfterBulk;
use Gally\Category\Decoration\SyncCategoryDataAfterBulkDelete;
use Gally\Category\Decoration\SyncCategoryDataAfterInstall;
use Gally\Category\Exception\SyncCategoryException;
use Gally\Category\Model\Category;
use Gally\Category\Model\Category\Configuration;
use Gally\Category\Repository\CategoryConfigurationRepository;
use Gally\Category\Repository\CategoryProductMerchandisingRepository;
use Gally\Category\Repository\CategoryRepository;
use Gally\Category\Service\CategoryProductPositionManager;
use Gally\Category\Service\CategorySynchronizer;
use Gally\Index\MutationResolver\BulkDeleteIndexMutation;
use Gally\Index\MutationResolver\BulkIndexMutation;
use Gally\Index\MutationResolver\InstallIndexMutation;
use Gally\Index\Repository\Index\IndexRepository;
use Gally\Index\Repository\Index\IndexRepositoryInterface;
use Gally\Index\Service\IndexSettings;
use Gally\Metadata\Repository\MetadataRepository;
use Gally\Search\Elasticsearch\Adapter;
use Gally\Search\Elasticsearch\Builder\Request\Query\QueryBuilder;
use Gally\Search\Elasticsearch\Request\Container\Configuration\ContainerConfigurationProvider;
use Gally\Search\Elasticsearch\RequestFactoryInterface;
use Gally\Test\AbstractTest;
use Gally\Test\ExpectedResponse;
use Gally\Test\RequestGraphQlToTest;
use Gally\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class CategorySynchronizerTest extends AbstractTest
{
    private static IndexRepositoryInterface $indexRepository;
    private static CategoryRepository $categoryRepository;
    private static CategoryConfigurationRepository $categoryConfigurationRepository;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        \assert(static::getContainer()->get(IndexRepositoryInterface::class) instanceof IndexRepositoryInterface);
        self::$indexRepository = static::getContainer()->get(IndexRepositoryInterface::class);
        self::$categoryRepository = static::getContainer()->get(CategoryRepository::class);
        self::$categoryConfigurationRepository = static::getContainer()->get(CategoryConfigurationRepository::class);
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

    public function testSynchronize(): void
    {
        /** @var EntityManager $entityManager */
        $entityManager = static::getContainer()->get('doctrine')->getManager();
        $catalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);

        $catalog1 = $catalogRepository->findOneBy(['code' => 'b2c_fr']);
        $catalog2 = $catalogRepository->findOneBy(['code' => 'b2c_en']);
        $catalog3 = $catalogRepository->findOneBy(['code' => 'b2b_fr']);
        $category1Data = ['id' => 'one', 'parentId' => null, 'level' => 1, 'name' => 'One'];
        $category2Data = ['id' => 'two', 'parentId' => null, 'level' => 1, 'name' => 'Two'];
        $category3Data = ['id' => 'three', 'parentId' => 'one', 'level' => 2, 'name' => 'Three'];
        $category4Data = ['id' => 'four', 'parentId' => 'three', 'level' => 3, 'name' => 'Four'];

        $this->validateCategoryCount(0, 0);

        // Create a non category index.
        $indexName = $this->createIndex('cms', $catalog1->getId());
        $this->installIndex($indexName);
        $this->validateCategoryCount(0, 0);

        // Create a non installed category index.
        $indexName = $this->createIndex('category', $catalog1->getId());
        $this->bulkIndex($indexName, ['one' => $category1Data, 'two' => $category2Data]);
        $this->validateCategoryCount(0, 0);

        // Install index.
        $this->installIndex($indexName);
        $this->validateCategoryCount(2, 2);

        // Add new documents.
        $this->bulkIndex($indexName, ['three' => $category3Data, 'four' => $category4Data]);
        $this->validateCategoryCount(4, 4);

        // Create an index for other catalogs.
        $this->prepareIndex($catalog2->getId(), ['one' => $category1Data, 'three' => $category3Data]);
        $this->prepareIndex($catalog3->getId(), ['one' => $category1Data, 'three' => $category3Data]);
        $this->validateCategoryCount(4, 8);

        // Remove documents.
        $this->bulkDeleteIndex($indexName, ['four']);
        $this->validateCategoryCount(3, 7);

        // Update documents.
        $category3 = self::$categoryRepository->find('three');
        $categoryConfigCatalog1 = self::$categoryConfigurationRepository->findOneBy(
            ['category' => $category3, 'localizedCatalog' => $catalog1]
        );
        $categoryConfigCatalog1->setIsVirtual(true);
        $entityManager->persist($category3);
        $entityManager->flush();
        $this->clearRepositoryCache();

        $category3Data['name'] = 'ThreeUpdated';
        $category3Data['parentId'] = '';
        $category3Data['level'] = 1;
        $this->bulkIndex($indexName, ['three' => $category3Data]);

        $this->validateCategoryCount(3, 7);
        $category3 = self::$categoryRepository->find('three');
        $this->assertSame(1, $category3->getLevel());
        $categoryConfigCatalog1 = self::$categoryConfigurationRepository->findOneBy(
            ['category' => $category3, 'localizedCatalog' => $catalog1]
        );
        $this->assertSame('ThreeUpdated', $categoryConfigCatalog1->getName());
        $this->assertTrue($categoryConfigCatalog1->getIsVirtual());
        $categoryConfigCatalog2 = self::$categoryConfigurationRepository->findOneBy(
            ['category' => $category3, 'localizedCatalog' => $catalog2]
        );
        $this->assertSame('Three', $categoryConfigCatalog2->getName());
        $this->assertFalse($categoryConfigCatalog2->getIsVirtual());

        // Add new specific configuration on catalog scope
        $category1 = self::$categoryRepository->find('one');
        $category2 = self::$categoryRepository->find('two');

        $entityManager->merge($this->createConfiguration($category1, null));
        $entityManager->merge($this->createConfiguration($category1, $catalog1->getCatalog()));
        $entityManager->merge($this->createConfiguration($category1, $catalog3->getCatalog()));
        $entityManager->merge($this->createConfiguration($category2, null));
        $entityManager->merge($this->createConfiguration($category2, $catalog1->getCatalog()));
        $entityManager->merge($this->createConfiguration($category3, null));

        $entityManager->flush();
        $this->validateCategoryCount(3, 13);

        // Create new index for catalog1 without category three
        $this->prepareIndex($catalog1->getId(), ['one' => $category1Data]);
        $this->prepareIndex($catalog2->getId(), ['three' => $category3Data]);
        $this->prepareIndex($catalog3->getId(), ['three' => $category3Data, 'four' => $category4Data]);
        $this->validateCategoryCount(3, 7);
    }

    public function testSynchronizeError(): void
    {
        $synchronizer = $this->getMockerSynchronizer();

        // Test error handling
        $catalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);
        $catalog1 = $catalogRepository->findOneBy(['code' => 'b2c_fr']);
        $indexName = $this->createIndex('category', $catalog1->getId());
        $this->installIndex($indexName);
        $index = self::$indexRepository->findByName($indexName);

        $this->expectException(SyncCategoryException::class);
        $this->expectExceptionMessage('error test message');
        $synchronizer->synchronize($index);
    }

    /**
     * @dataProvider retryTestDataProvider
     */
    public function testSynchronizeRetry(string $mutationClass, string $decorator, array $constructorParams = []): void
    {
        $synchronizer = $this->getMockerSynchronizer(true);
        $catalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);
        $catalog1 = $catalogRepository->findOneBy(['code' => 'b2c_fr']);
        sleep(1); // Avoid creating two index at the same second
        $indexName = $this->createIndex('category', $catalog1->getId());
        $this->installIndex($indexName);
        $index = self::$indexRepository->findByName($indexName);

        $mutationMock = $this->getMockBuilder($mutationClass)
            ->disableOriginalConstructor()
            ->getMock();
        $mutationMock->method('__invoke')->willReturn($index);
        $decorator = new $decorator(
            $mutationMock,
            $synchronizer,
            ...$constructorParams,
        );

        $this->assertEquals($index, $decorator->__invoke(null, ['args' => ['input' => ['data' => '[]']]]));

        $synchronizer = $this->getMockerSynchronizer();
        $decorator = new $decorator(
            $mutationMock,
            $synchronizer,
            ...$constructorParams,
        );
        $this->expectException(SyncCategoryException::class);
        $decorator->__invoke(null, ['args' => ['input' => ['data' => '[]']]]);
    }

    public function retryTestDataProvider(): iterable
    {
        $indexSettings = static::getContainer()->get(IndexSettings::class);
        $indexRepository = static::getContainer()->get(IndexRepository::class);
        $categoryProductPositionManager = static::getContainer()->get(CategoryProductPositionManager::class);
        $categoryProductMerchandisingRepository = static::getContainer()->get(CategoryProductMerchandisingRepository::class);

        yield [InstallIndexMutation::class, SyncCategoryDataAfterInstall::class, [$categoryProductPositionManager]];
        yield [BulkIndexMutation::class, SyncCategoryDataAfterBulk::class, [$indexSettings, $indexRepository, $categoryProductPositionManager]];
        yield [BulkDeleteIndexMutation::class, SyncCategoryDataAfterBulkDelete::class, [$indexSettings, $indexRepository, $categoryProductMerchandisingRepository]];
    }

    private function prepareIndex(int $catalogId, array $data): void
    {
        $indexName = $this->createIndex('category', $catalogId);
        $this->bulkIndex($indexName, $data);
        $this->installIndex($indexName);
    }

    private function validateCategoryCount(int $categoryCount, int $categoryConfigCount): void
    {
        $this->assertCount($categoryCount, self::$categoryRepository->findAll());
        $this->assertCount($categoryConfigCount, self::$categoryConfigurationRepository->findAll());
    }

    private function createConfiguration(Category $category, ?Catalog $catalog): Configuration
    {
        $config = new Configuration();
        $config->setCategory($category);
        $config->setCatalog($catalog);
        $config->setIsVirtual(true);

        return $config;
    }

    private function clearRepositoryCache(): void
    {
        /** @var EntityManager */
        $entityManager = static::getContainer()->get('doctrine')->getManager();
        // Clear cache and instantiate a new repository to force repository to get a fresh db object.
        $entityManager->clear(self::$categoryRepository->getClassName());
        $entityManager->clear(self::$categoryConfigurationRepository->getClassName());
        self::$categoryRepository = static::getContainer()->get(CategoryRepository::class);
        self::$categoryConfigurationRepository = static::getContainer()->get(CategoryConfigurationRepository::class);
    }

    private function createIndex(string $entityType, int $catalogId): string
    {
        $indexName = '';
        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    mutation {
                      createIndex(input: {
                        entityType: "{$entityType}",
                        localizedCatalog: "{$catalogId}"
                      }) {
                        index {
                          id
                          name
                          aliases
                        }
                      }
                    }
                GQL,
                $this->getUser(Role::ROLE_ADMIN),
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use (&$indexName) {
                    $responseData = $response->toArray();
                    $indexName = $responseData['data']['createIndex']['index']['name'];
                }
            )
        );

        return $indexName;
    }

    private function installIndex(string $indexName): void
    {
        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    mutation {
                      installIndex(input: {
                        name: "$indexName"
                      }) {
                        index {
                          id
                          name
                          aliases
                        }
                      }
                    }
                GQL,
                $this->getUser(Role::ROLE_ADMIN),
            ),
            new ExpectedResponse(200)
        );
    }

    private function bulkIndex(string $indexName, array $data): void
    {
        $data = addslashes(json_encode($data));
        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    mutation {
                      bulkIndex(input: {
                        indexName: "{$indexName}",
                        data: "{$data}"
                      }) {
                        index { name }
                      }
                    }
                GQL,
                $this->getUser(Role::ROLE_ADMIN),
            ),
            new ExpectedResponse(200)
        );
    }

    private function bulkDeleteIndex(string $indexName, array $ids): void
    {
        $ids = json_encode($ids);
        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    mutation {
                      bulkDeleteIndex(input: {
                        indexName: "{$indexName}",
                        ids: $ids
                      }) {
                        index { name }
                      }
                    }
                GQL,
                $this->getUser(Role::ROLE_ADMIN),
            ),
            new ExpectedResponse(200)
        );
    }

    private function getMockerSynchronizer(bool $succeedOnRetry = false): CategorySynchronizer
    {
        $configurationMock = $this->getMockBuilder(\Doctrine\DBAL\Configuration::class)
            ->disableOriginalConstructor()
            ->getMock();
        $connectionMock = $this->getMockBuilder(Connection::class)
            ->disableOriginalConstructor()
            ->getMock();
        $entityManagerMock = $this->getMockBuilder(EntityManagerInterface::class)
            ->disableOriginalConstructor()
            ->getMock();

        $exception = new ORMException('error test message');

        $connectionMock->method('getConfiguration')->willReturn($configurationMock);
        $entityManagerMock->method('getConnection')->willReturn($connectionMock);
        if ($succeedOnRetry) {
            $entityManagerMock
                ->method('flush')
                ->will($this->onConsecutiveCalls($this->throwException($exception), true));
        } else {
            $entityManagerMock->method('flush')->willThrowException($exception);
        }

        return new CategorySynchronizer(
            static::getContainer()->get(CategoryRepository::class),
            static::getContainer()->get(CategoryConfigurationRepository::class),
            static::getContainer()->get(RequestFactoryInterface::class),
            static::getContainer()->get(QueryBuilder::class),
            static::getContainer()->get(Adapter::class),
            static::getContainer()->get(ContainerConfigurationProvider::class),
            static::getContainer()->get(MetadataRepository::class),
            $entityManagerMock,
        );
    }
}
