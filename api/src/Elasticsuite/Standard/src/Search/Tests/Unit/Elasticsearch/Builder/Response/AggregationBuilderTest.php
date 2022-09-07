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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Builder\Response;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Response\Aggregation;
use Elasticsuite\Search\Elasticsearch\Adapter\Common\Response\BucketValue;
use Elasticsuite\Search\Elasticsearch\Builder\Response\AggregationBuilder;
use Elasticsuite\Test\AbstractTest;

class AggregationBuilderTest extends AbstractTest
{
    private static AggregationBuilder $aggregationBuilder;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::$aggregationBuilder = new AggregationBuilder();
    }

    public function testSimpleAggregation(): void
    {
        $aggregation = self::$aggregationBuilder->create(
            'testField',
            [
                'doc_count_error_upper_bound' => 0,
                'sum_other_doc_count' => 1,
                'buckets' => [
                    ['key' => 'test1', 'doc_count' => 2],
                    ['key' => 'test2', 'doc_count' => 1],
                ],
            ]
        );

        $this->assertEquals('testField', $aggregation->getField());
        $this->assertEquals('testField', $aggregation->getName());
        $this->assertCount(3, $aggregation->getValues());
        $this->assertEquals(4, $aggregation->getCount());

        $values = $aggregation->getValues();
        $exempleValue = new BucketValue('test1', 2, []);
        $this->assertEquals($exempleValue, $values['test1']);
        $exempleValue = new BucketValue('test2', 1, []);
        $this->assertEquals($exempleValue, $values['test2']);
        $exempleValue = new BucketValue('__other_docs', 1, []);
        $this->assertEquals($exempleValue, $values['__other_docs']);
    }

    public function testComplexeAggregation(): void
    {
        $aggregation = self::$aggregationBuilder->create(
            'price',
            [
                'buckets' => [
                    [
                        'key' => 11,
                        'doc_count' => 2,
                        'updated_at' => [
                            'value' => 1640010501200,
                            'value_as_string' => '2021-12-20 14:28:21',
                        ],
                        'brand' => [
                            'doc_count_error_upper_bound' => 0,
                            'sum_other_doc_count' => 0,
                            'buckets' => [
                                ['key' => 'test1', 'doc_count' => 2],
                            ],
                        ],
                    ],
                    [
                        'key' => 12,
                        'doc_count' => 1,
                        'updated_at' => [
                            'value' => 1640010501200,
                            'value_as_string' => '2021-12-20 14:28:21',
                        ],
                        'brand' => [
                            'doc_count_error_upper_bound' => 0,
                            'sum_other_doc_count' => 0,
                            'buckets' => [
                                ['key' => 'test2', 'doc_count' => 1],
                            ],
                        ],
                    ],
                ],
            ]
        );

        $this->assertEquals('price', $aggregation->getField());
        $this->assertEquals('price', $aggregation->getName());
        $this->assertCount(2, $aggregation->getValues());
        $this->assertEquals(3, $aggregation->getCount());

        $values = $aggregation->getValues();
        $exempleValue = new BucketValue(
            11,
            2,
            [
                'updated_at' => new Aggregation('updated_at', ['value' => '2021-12-20 14:28:21'], null),
                'brand' => new Aggregation('brand', ['test1' => new BucketValue('test1', 2, [])], 2),
            ]
        );
        $this->assertEquals($exempleValue, $values['11']);
        $exempleValue = new BucketValue(
            12,
            1,
            [
                'updated_at' => new Aggregation('updated_at', ['value' => '2021-12-20 14:28:21'], null),
                'brand' => new Aggregation('brand', ['test2' => new BucketValue('test2', 1, [])], 1),
            ]
        );
        $this->assertEquals($exempleValue, $values['12']);
    }
}
