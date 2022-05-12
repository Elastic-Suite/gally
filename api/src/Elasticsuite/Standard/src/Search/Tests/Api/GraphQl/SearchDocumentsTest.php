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

namespace Elasticsuite\Search\Tests\Api\GraphQl;

use Elasticsuite\Fixture\Service\ElasticsearchFixturesInterface;
use Elasticsuite\Standard\src\Test\AbstractTest;
use Elasticsuite\Standard\src\Test\ExpectedResponse;
use Elasticsuite\Standard\src\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class SearchDocumentsTest extends AbstractTest
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
     * @dataProvider basicSearchDataProvider
     *
     * @param string $entityType           Entity Type
     * @param string $catalogId            Catalog ID
     * @param ?int   $pageSize             Pagination size
     * @param ?int   $currentPage          Current page
     * @param ?array $expectedError        Expected error
     * @param ?int   $expectedItemsCount   Expected items count in (paged) response
     * @param ?int   $expectedTotalCount   Expected total items count
     * @param ?int   $expectedItemsPerPage Expected pagination items per page
     * @param ?int   $expectedLastPage     Expected number of the last page
     */
    public function testBasicSearchDocuments(
        string $entityType,
        string $catalogId,
        ?int $pageSize,
        ?int $currentPage,
        ?array $expectedError,
        ?int $expectedItemsCount,
        ?int $expectedTotalCount,
        ?int $expectedItemsPerPage,
        ?int $expectedLastPage,
        ?string $expectedIndex,
        ?float $expectedScore
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        $arguments = sprintf(
            'entityType: "%s", catalogId: "%s"',
            $entityType,
            $catalogId
        );
        if (null !== $pageSize) {
            $arguments .= sprintf(', pageSize: %d', $pageSize);
        }
        if (null !== $currentPage) {
            $arguments .= sprintf(', currentPage: %d', $currentPage);
        }

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        searchDocuments({$arguments}) {
                            collection {
                              id
                              score
                              index
                            }
                            paginationInfo {
                              itemsPerPage
                              lastPage
                              totalCount
                            }
                        }
                    }
                GQL,
                $user
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use (
                        $expectedError,
                        $expectedItemsCount,
                        $expectedTotalCount,
                        $expectedItemsPerPage,
                        $expectedLastPage,
                        $expectedIndex,
                        $expectedScore
                    ) {
                    if (!empty($expectedError)) {
                        $this->assertJsonContains($expectedError);
                        $this->assertJsonContains([
                            'data' => [
                                'searchDocuments' => null,
                            ],
                        ]);
                    } else {
                        $this->assertJsonContains([
                            'data' => [
                                'searchDocuments' => [
                                    'paginationInfo' => [
                                        'itemsPerPage' => $expectedItemsPerPage,
                                        'lastPage' => $expectedLastPage,
                                        'totalCount' => $expectedTotalCount,
                                    ],
                                ],
                            ],
                        ]);

                        $responseData = $response->toArray();
                        $this->assertIsArray($responseData['data']['searchDocuments']['collection']);
                        $this->assertCount($expectedItemsCount, $responseData['data']['searchDocuments']['collection']);
                        foreach ($responseData['data']['searchDocuments']['collection'] as $document) {
                            $this->assertArrayHasKey('score', $document);
                            $this->assertEquals($expectedScore, $document['score']);

                            $this->assertArrayHasKey('index', $document);
                            $this->assertEquals($expectedIndex, $document['index']);
                        }
                    }
                }
            )
        );
    }

    public function basicSearchDataProvider(): array
    {
        return [
            [
                'people',
                'b2c_fr',
                null,
                null,
                ['errors' => [['message' => 'Internal server error', 'debugMessage' => 'Entity type [people] does not exist']]],
                null,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                'category',
                'b2c_uk',
                null,
                null,
                ['errors' => [['message' => 'Internal server error', 'debugMessage' => 'Missing catalog.']]],
                null,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                'category',
                'b2c_fr',
                null,
                null,
                [],
                0,
                0,
                30,
                1,
                null,
                1.0,
            ],
            [
                'product',
                '2',
                10,
                1,
                [],
                10,
                14,
                10,
                2,
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_b2c_en_product_20220429_153000',
                1.0,
            ],
            [
                'product',
                'b2c_en',
                10,
                1,
                [],
                10,
                14,
                10,
                2,
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_b2c_en_product_20220429_153000',
                1.0,
            ],
            [
                'product',
                'b2c_en',
                10,
                2,
                [],
                4,
                14,
                10,
                2,
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_b2c_en_product_20220429_153000',
                1.0,
            ],
            [
                'product',
                'b2b_fr',
                null,
                null,
                [],
                12,
                12,
                30,
                1,
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_b2b_fr_product_20220601_171005',
                1.0,
            ],
            [
                'product',
                'b2b_fr',
                5,
                2,
                [],
                5,
                12,
                5,
                3,
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_b2b_fr_product_20220601_171005',
                1.0,
            ],
            [
                'product',
                'b2b_fr',
                1000,
                null,
                [],
                12,
                12,
                100,
                1,
                ElasticsearchFixturesInterface::PREFIX_TEST_INDEX . 'elasticsuite_test_b2b_fr_product_20220601_171005',
                1.0,
            ],
        ];
    }
}
