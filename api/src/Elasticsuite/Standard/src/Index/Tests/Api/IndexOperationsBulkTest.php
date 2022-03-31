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

use Elasticsuite\Fixture\Service\ElasticsearchFixturesInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class IndexOperationsBulkTest extends AbstractTest
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->loadElasticsearchIndexFixtures([
            __DIR__ . '/../fixtures/indices.json',
        ]);
        $this->loadElasticsearchDocumentFixtures([
            __DIR__ . '/../fixtures/documents.json',
        ]);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        $this->deleteElasticsearchFixtures();
    }

    public function testBulkIndex(): void
    {
        $indexName = ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'index_product';
        $documents = [
            'id1' => ['name' => 'Test doc 1', 'size' => 12],
            'id2' => ['name' => 'Test doc 2', 'size' => 8],
            'id3' => ['name' => 'Test doc 3', 'size' => 5],
        ];

        $this->performBulkIndexTest($indexName, $documents);
        $this->assertJsonContains(['data' => ['bulkIndex' => ['index' => ['name' => $indexName]]]]);

        $this->performBulkIndexTest('wrongName', $documents);
        $this->assertJsonContains(
            ['errors' => [['debugMessage' => 'Index with name [wrongName] does not exist']]]
        );

        $documents['id2'] = ['name' => 'Test doc 2', 'size' => 'wrongSize'];
        $this->performBulkIndexTest($indexName, $documents);
        $message = sprintf(
            'Bulk index operation failed %d times in index %s. ' .
            'Error (mapper_parsing_exception) : failed to parse field [size] of type [integer] in document with id \'id2\'. ' .
            'Preview of field\'s value: \'wrongSize\'. Failed doc ids sample : id2.',
            1,
            $indexName
        );
        $this->assertJsonContains(['errors' => [['debugMessage' => $message]]]);
    }

    protected function performBulkIndexTest(string $indexName, array $data): ResponseInterface
    {
        $data = addslashes(json_encode($data));
        $query = <<<GQL
            mutation {
              bulkIndex(input: {
                indexName: "{$indexName}",
                data: "{$data}"
              }) {
                index { name }
              }
            }
        GQL;

        return $this->requestGraphQl($query);
    }

    public function testBulkDeleteIndex(): void
    {
        $indexName = ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'index_product';
        $ids = ['test_1', 'test_2', 'test_3'];

        $this->performBulkDeleteIndexTest($indexName, $ids);
        $this->assertJsonContains(['data' => ['bulkDeleteIndex' => ['index' => ['name' => $indexName]]]]);

        $this->performBulkDeleteIndexTest('wrongName', $ids);
        $this->assertJsonContains(
            ['errors' => [['debugMessage' => 'Index with name [wrongName] does not exist']]]
        );

        $documents[] = 'test_wrongId';
        $this->performBulkDeleteIndexTest($indexName, $documents);
        $this->assertJsonContains(['data' => ['bulkDeleteIndex' => ['index' => ['name' => $indexName]]]]);
    }

    protected function performBulkDeleteIndexTest(string $indexName, array $ids): ResponseInterface
    {
        $ids = json_encode($ids);
        $query = <<<GQL
            mutation {
              bulkDeleteIndex(input: {
                indexName: "{$indexName}",
                ids: $ids
              }) {
                index { name }
              }
            }
        GQL;

        return $this->requestGraphQl($query);
    }
}
