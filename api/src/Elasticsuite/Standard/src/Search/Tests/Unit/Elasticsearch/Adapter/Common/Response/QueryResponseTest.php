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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Adapter\Common\Response;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Response;
use Elasticsuite\Search\Elasticsearch\DocumentInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class QueryResponseTest extends KernelTestCase
{
    /**
     * @dataProvider queryResponseDocumentsOnlyDataProvider
     *
     * @param array $searchResponse    Raw search response from Elasticsearch
     * @param int   $expectedDocsCount Expected documents count in the query response
     */
    public function testTraversableCountable(array $searchResponse, int $expectedDocsCount): void
    {
        $queryResponse = new Response\QueryResponse($searchResponse);
        $this->assertCount($expectedDocsCount, $queryResponse);
        $this->assertContainsOnlyInstancesOf(DocumentInterface::class, $queryResponse);
    }

    public function queryResponseDocumentsOnlyDataProvider(): array
    {
        return [
            [
                [
                    'hits' => [
                        'hits' => [
                            [
                                '_id' => '1',
                                '_score' => 1.0,
                                '_source' => [
                                    ['field' => 'value'],
                                ],
                            ],
                        ],
                        'total' => 1,
                    ],
                ],
                1,
            ],
            [
                [
                    'hits' => [
                        'hits' => [
                            [
                                '_id' => '1',
                                '_score' => 1.1,
                                '_source' => [
                                    ['field' => 'value'],
                                ],
                            ],
                            [
                                '_id' => '2',
                                '_score' => 1.0,
                                '_source' => [
                                    ['field1' => 'value1', 'field2' => 'value2'],
                                ],
                            ],
                        ],
                        'total' => ['value' => 2],
                    ],
                ],
                2,
            ],
            [
                [
                    'hits' => [
                        'hits' => [],
                        'total' => 0,
                    ],
                ],
                0,
            ],
            [
                [],
                0,
            ],
        ];
    }
}
