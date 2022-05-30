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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Bucket;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Bucket\Term as TermAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Bucket\Term;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Search adapter term aggregation assembler test case.
 */
class TermTest extends KernelTestCase
{
    /**
     * Test the standard term aggregation building.
     */
    public function testBasicTermAggregationBuild(): void
    {
        $aggBuilder = $this->getAggregationAssembler();
        $termBucket = new Term('aggregationName', 'fieldName');

        $aggregation = $aggBuilder->assembleAggregation($termBucket);

        $this->assertArrayHasKey('terms', $aggregation);
        $this->assertEquals('fieldName', $aggregation['terms']['field']);
        $this->assertEquals(BucketInterface::MAX_BUCKET_SIZE, $aggregation['terms']['size']);
        $this->assertEquals([BucketInterface::SORT_ORDER_COUNT => SortOrderInterface::SORT_DESC], $aggregation['terms']['order']);
    }

    /**
     * Test the standard term aggregation assembling sorted by alphabetic order.
     */
    public function testAlphabeticSortOrderTermAggregationBuild(): void
    {
        $aggBuilder = $this->getAggregationAssembler();
        $termBucket = new Term('aggregationName', 'fieldName', [], null, null, null, 0, BucketInterface::SORT_ORDER_TERM, [], [], 1);

        $aggregation = $aggBuilder->assembleAggregation($termBucket);

        $this->assertArrayHasKey('terms', $aggregation);
        $this->assertEquals('fieldName', $aggregation['terms']['field']);
        $this->assertEquals([BucketInterface::SORT_ORDER_TERM => SortOrderInterface::SORT_ASC], $aggregation['terms']['order']);
    }

    /**
     * Test the standard term aggregation building sorted by relevance.
     */
    public function testRelevanceSortOrderTermAggregationBuild(): void
    {
        $aggBuilder = $this->getAggregationAssembler();
        $termBucket = new Term('aggregationName', 'fieldName', [], null, null, null, 0, BucketInterface::SORT_ORDER_RELEVANCE, [], [], 2);

        $aggregation = $aggBuilder->assembleAggregation($termBucket);

        $this->assertArrayHasKey('terms', $aggregation);
        $this->assertEquals('fieldName', $aggregation['terms']['field']);
        $this->assertEquals(['termRelevance' => SortOrderInterface::SORT_DESC], $aggregation['terms']['order']);
        $this->assertArrayHasKey('aggregations', $aggregation);
        $this->assertArrayHasKey('termRelevance', $aggregation['aggregations']);
        $this->assertEquals(['avg' => ['script' => BucketInterface::SORT_ORDER_RELEVANCE]], $aggregation['aggregations']['termRelevance']);
    }

    /**
     * Test the standard term aggregation building with filter.
     */
    public function testWithFilter(): void
    {
        $filter = $this->getMockBuilder(QueryInterface::class)->getMock();
        $filter->method('getName')->willReturn('filter1');

        $aggBuilder = $this->getAggregationAssembler();
        $termBucket = new Term(
            'aggregationName',
            'fieldName',
            [],
            null,
            $filter
        );

        $aggregation = $aggBuilder->assembleAggregation($termBucket);

        $this->assertArrayHasKey('terms', $aggregation);
        $this->assertEquals('fieldName', $aggregation['terms']['field']);
        $this->assertEquals([BucketInterface::SORT_ORDER_COUNT => SortOrderInterface::SORT_DESC], $aggregation['terms']['order']);
    }

    /**
     * Test an exception is thrown when using the term aggs builder with another bucket type.
     */
    public function testInvalidBucketAggregationBuild(): void
    {
        $this->expectExceptionMessage('Aggregation assembler : invalid aggregation type invalidType.');
        $this->expectException(\InvalidArgumentException::class);
        $termBucket = $this->getMockBuilder(BucketInterface::class)->getMock();
        $termBucket->method('getType')->willReturn('invalidType');

        $this->getAggregationAssembler()->assembleAggregation($termBucket);
    }

    /**
     * Test the max bucket size limitation.
     *
     * @dataProvider sizeDataProvider
     *
     * @param int $size     configured bucket size
     * @param int $expected expected bucket size in the built aggregation
     */
    public function testBucketSize(int $size, int $expected): void
    {
        $aggBuilder = $this->getAggregationAssembler();
        $termBucket = new Term('aggregationName', 'fieldName', [], null, null, null, $size);

        $aggregation = $aggBuilder->assembleAggregation($termBucket);

        $this->assertEquals($expected, $aggregation['terms']['size']);
    }

    /**
     * Dataset used to run testBucketSize.
     */
    public function sizeDataProvider(): array
    {
        return [
            [0, BucketInterface::MAX_BUCKET_SIZE],
            [BucketInterface::MAX_BUCKET_SIZE - 1, BucketInterface::MAX_BUCKET_SIZE - 1],
            [BucketInterface::MAX_BUCKET_SIZE, BucketInterface::MAX_BUCKET_SIZE],
            [BucketInterface::MAX_BUCKET_SIZE + 1, BucketInterface::MAX_BUCKET_SIZE],
        ];
    }

    /**
     * Aggregation assembler used in tests.
     */
    private function getAggregationAssembler(): TermAssembler
    {
        return new TermAssembler();
    }
}
