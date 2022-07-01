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

use Doctrine\ORM\EntityManager;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Category\Repository\CategoryRepository;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;
use Elasticsuite\Standard\src\Test\AbstractTest;
use Elasticsuite\Standard\src\Test\ExpectedResponse;
use Elasticsuite\Standard\src\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class CategorySynchronizerTest extends AbstractTest
{
    private static IndexRepositoryInterface $indexRepository;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        \assert(static::getContainer()->get(IndexRepositoryInterface::class) instanceof IndexRepositoryInterface);
        self::$indexRepository = static::getContainer()->get(IndexRepositoryInterface::class);
        self::loadFixture([
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
        ]);
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::$indexRepository->delete('elasticsuite_test__elasticsuite_*');
    }

    public function testSynchronize(): void
    {
        $categoryRepository = static::getContainer()->get(CategoryRepository::class);
        $catalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);

        $catalog = $catalogRepository->findOneBy(['code' => 'b2c_fr']);
        $categ1Data = ['categoryId' => 'one', 'parentId' => null, 'level' => 1, 'name' => 'One'];
        $categ2Data = ['categoryId' => 'two', 'parentId' => null, 'level' => 1, 'name' => 'Two'];
        $categ3Data = ['categoryId' => 'three', 'parentId' => 'one', 'level' => 2, 'name' => 'Three'];
        $categ4Data = ['categoryId' => 'four', 'parentId' => 'three', 'level' => 3, 'name' => 'Four'];

        $this->assertCount(0, $categoryRepository->findAll());

        // Create a non category index.
        $indexName = $this->createIndex('cms', $catalog->getId());
        $this->installIndex($indexName);
        $this->bulkIndex(
            $indexName,
            ['one' => $categ1Data, 'two' => $categ2Data]
        );
        $this->assertCount(0, $categoryRepository->findAll());

        // Create a non installed category index.
        $indexName = $this->createIndex('category', $catalog->getId());
        $this->bulkIndex(
            $indexName,
            ['one' => $categ1Data, 'two' => $categ2Data]
        );
        $this->assertCount(0, $categoryRepository->findAll());

        // Install index.
        $this->installIndex($indexName);
        $this->assertCount(2, $categoryRepository->findAll());

        // Add documents.
        $this->bulkIndex(
            $indexName,
            ['three' => $categ3Data, 'four' => $categ4Data]
        );
        $this->assertCount(4, $categoryRepository->findAll());

        // Remove documents.
        $this->bulkDeleteIndex($indexName, ['four']);
        $this->assertCount(3, $categoryRepository->findAll());

        // Create category configuration on an other catalog
        $catalog2 = $catalogRepository->findOneBy(['code' => 'b2c_en']);
        $indexName = $this->createIndex('category', $catalog2->getId());
        $this->assertCount(3, $categoryRepository->findAll());
        $this->bulkIndex(
            $indexName,
            ['one' => $categ1Data, 'two' => $categ2Data]
        );
        $this->installIndex($indexName);
        $this->assertCount(5, $categoryRepository->findAll());

        /** @var EntityManager */
        $entityManager = static::getContainer()->get('doctrine')->getManager();
        // Clear cache and instantiate a new repository to force repository to get a fresh db object.
        $entityManager->clear($categoryRepository->getClassName());
        $categoryRepository = static::getContainer()->get(CategoryRepository::class);

        // Update documents.
        $categ2Data['name'] = 'TwoUpdated';
        $this->bulkIndex($indexName, ['two' => $categ2Data]);
        $this->assertCount(5, $categoryRepository->findAll());
        $categ2Catalog1 = $categoryRepository->findOneBy(['categoryId' => 'two', 'catalog' => $catalog]);
        $this->assertSame('Two', $categ2Catalog1->getName());
        $categ2Catalog2 = $categoryRepository->findOneBy(['categoryId' => 'two', 'catalog' => $catalog2]);
        $this->assertSame('TwoUpdated', $categ2Catalog2->getName());
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

    public function installIndex(string $indexName): void
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

    public function bulkIndex(string $indexName, array $data): void
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

    public function bulkDeleteIndex(string $indexName, array $ids): void
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
}
