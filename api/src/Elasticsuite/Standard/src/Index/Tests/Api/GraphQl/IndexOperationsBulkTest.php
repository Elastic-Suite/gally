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

use Elasticsuite\Fixture\Service\ElasticsearchFixturesInterface;
use Elasticsuite\Standard\src\Test\AbstractTest;
use Elasticsuite\Standard\src\Test\ExpectedResponse;
use Elasticsuite\Standard\src\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Elasticsuite\User\Model\User;
use Symfony\Contracts\HttpClient\ResponseInterface;

class IndexOperationsBulkTest extends AbstractTest
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::loadElasticsearchIndexFixtures([__DIR__ . '/../../fixtures/indices.json']);
        self::loadElasticsearchDocumentFixtures([__DIR__ . '/../../fixtures/documents.json']);
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::deleteElasticsearchFixtures();
    }

    /**
     * @dataProvider bulkIndexDataProvider
     */
    public function testBulkIndex(string $indexName, array $data, User $user, array $expectedData): void
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
                $user
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($expectedData) {
                    $this->assertJsonContains($expectedData);
                }
            )
        );
    }

    public function bulkIndexDataProvider(): iterable
    {
        $admin = $this->getUser(Role::ROLE_ADMIN);
        $indexName = ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'index_product';
        $documents = [
            'id1' => ['name' => 'Test doc 1', 'size' => 12],
            'id2' => ['name' => 'Test doc 2', 'size' => 8],
            'id3' => ['name' => 'Test doc 3', 'size' => 5],
        ];

        yield [$indexName, $documents, $this->getUser(Role::ROLE_CONTRIBUTOR), ['errors' => [['debugMessage' => 'Access Denied.']]]];
        yield [$indexName, $documents, $admin, ['data' => ['bulkIndex' => ['index' => ['name' => $indexName]]]]];
        yield ['wrongName', $documents, $admin, ['errors' => [['debugMessage' => 'Index with name [wrongName] does not exist']]]];

        $documents['id2'] = ['name' => 'Test doc 2', 'size' => 'wrongSize'];
        $message = sprintf(
            'Bulk index operation failed %d times in index %s. ' .
            'Error (mapper_parsing_exception) : failed to parse field [size] of type [integer] in document with id \'id2\'. ' .
            'Preview of field\'s value: \'wrongSize\'. Failed doc ids sample : id2.',
            1,
            $indexName
        );
        yield [$indexName, $documents, $admin, ['errors' => [['debugMessage' => $message]]]];
    }

    /**
     * @dataProvider bulkDeleteDataProvider
     */
    public function testBulkDeleteIndex(string $indexName, array $ids, User $user, array $expectedData): void
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
                $user
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($expectedData) {
                    $this->assertJsonContains($expectedData);
                }
            )
        );
    }

    public function bulkDeleteDataProvider(): iterable
    {
        $admin = $this->getUser(Role::ROLE_ADMIN);
        $indexName = ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'index_product';
        $ids = ['test_1', 'test_2', 'test_3'];

        yield [$indexName, $ids, $this->getUser(Role::ROLE_CONTRIBUTOR), ['errors' => [['debugMessage' => 'Access Denied.']]]];
        yield [$indexName, $ids, $admin, ['data' => ['bulkDeleteIndex' => ['index' => ['name' => $indexName]]]]];
        yield ['wrongName', $ids, $admin, ['errors' => [['debugMessage' => 'Index with name [wrongName] does not exist']]]];

        $ids[] = 'test_wrongId';
        yield [$indexName, $ids, $admin, ['data' => ['bulkDeleteIndex' => ['index' => ['name' => $indexName]]]]];
    }
}
