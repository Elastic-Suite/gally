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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Bucket;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Bucket\MultiTerms as MultiTermsAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Bucket\MultiTerms;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MultiTermsTest extends KernelTestCase
{
    /**
     * Test the standard term aggregation building.
     */
    public function testBasicTermAggregationBuild(): void
    {
        $aggBuilder = $this->getAggregationAssembler();
        $multiTermBucket = new MultiTerms('aggregationName', 'fieldName', ['otherFieldName']);

        $aggregation = $aggBuilder->assembleAggregation($multiTermBucket);

        $this->assertArrayHasKey('multi_terms', $aggregation);
        $this->assertArrayHasKey('terms', $aggregation['multi_terms']);
        $this->assertIsArray($aggregation['multi_terms']['terms']);
        $this->assertEquals(
            [['field' => 'otherFieldName', 'missing' => 'None'], ['field' => 'fieldName', 'missing' => 'None']],
            $aggregation['multi_terms']['terms']
        );
        $this->assertEquals(BucketInterface::MAX_BUCKET_SIZE, $aggregation['multi_terms']['size']);
        $this->assertEquals([BucketInterface::SORT_ORDER_COUNT => SortOrderInterface::SORT_DESC], $aggregation['multi_terms']['order']);
    }

    /**
     * Test the standard term aggregation assembling sorted by alphabetic order.
     */
    public function testAlphabeticSortOrderTermAggregationBuild(): void
    {
        $aggBuilder = $this->getAggregationAssembler();
        $multiTermBucket = new MultiTerms(
            'aggregationName',
            'fieldName',
            ['otherFieldName'],
            [],
            null,
            null,
            null,
            0,
            BucketInterface::SORT_ORDER_TERM,
            [],
            [],
            1
        );

        $aggregation = $aggBuilder->assembleAggregation($multiTermBucket);

        $this->assertArrayHasKey('multi_terms', $aggregation);
        // $this->assertArrayHasKey('terms', $aggregation['multi_terms']);
        // $this->assertIsArray($aggregation['multi_terms']['terms']);
        // $this->assertEquals([['field' => 'fieldName'], ['field' => 'otherFieldName']], $aggregation['multi_terms']['terms']);
        $this->assertEquals([BucketInterface::SORT_ORDER_TERM => SortOrderInterface::SORT_ASC], $aggregation['multi_terms']['order']);
    }

    /**
     * Test the standard term aggregation assembling sorted by a custom sort order.
     */
    public function testCustomSortOrderTermAggregationBuild(): void
    {
        $aggBuilder = $this->getAggregationAssembler();
        $sortOrder = [BucketInterface::SORT_ORDER_TERM => SortOrderInterface::SORT_DESC];
        $termsBucket = new MultiTerms(
            'aggregationName',
            'fieldName',
            ['otherFieldName'],
            [],
            null,
            null,
            null,
            0,
            $sortOrder,
            [],
            [],
            1
        );

        $aggregation = $aggBuilder->assembleAggregation($termsBucket);

        $this->assertArrayHasKey('multi_terms', $aggregation);
        // $this->assertEquals('fieldName', $aggregation['terms']['field']);
        $this->assertEquals([BucketInterface::SORT_ORDER_TERM => SortOrderInterface::SORT_DESC], $aggregation['multi_terms']['order']);
    }

    /**
     * Test the standard term aggregation building sorted by relevance.
     */
    public function testRelevanceSortOrderTermAggregationBuild(): void
    {
        $aggBuilder = $this->getAggregationAssembler();
        $multiTermBucket = new MultiTerms(
            'aggregationName',
            'fieldName',
            ['otherFieldName'],
            [],
            null,
            null,
            null,
            0,
            BucketInterface::SORT_ORDER_RELEVANCE,
            [],
            [], 2
        );

        $aggregation = $aggBuilder->assembleAggregation($multiTermBucket);

        $this->assertArrayHasKey('multi_terms', $aggregation);
        // $this->assertArrayHasKey('terms', $aggregation['multi_terms']);
        // $this->assertIsArray($aggregation['multi_terms']['terms']);
        // $this->assertEquals([['field' => 'fieldName'], ['field' => 'otherFieldName']], $aggregation['multi_terms']['terms']);
        $this->assertEquals(['termRelevance' => SortOrderInterface::SORT_DESC], $aggregation['multi_terms']['order']);
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
        $multiTermBucket = new MultiTerms(
            'aggregationName',
            'fieldName',
            ['otherFieldName'],
            [],
            null,
            $filter
        );

        $aggregation = $aggBuilder->assembleAggregation($multiTermBucket);

        $this->assertArrayHasKey('multi_terms', $aggregation);
        // $this->assertEquals('fieldName', $aggregation['terms']['field']);
        $this->assertArrayHasKey('terms', $aggregation['multi_terms']);
        $this->assertIsArray($aggregation['multi_terms']['terms']);
        $this->assertEquals([
            ['field' => 'otherFieldName', 'missing' => 'None'], ['field' => 'fieldName', 'missing' => 'None'], ],
            $aggregation['multi_terms']['terms']
        );
        $this->assertEquals([BucketInterface::SORT_ORDER_COUNT => SortOrderInterface::SORT_DESC], $aggregation['multi_terms']['order']);
    }

    /**
     * Test an exception is thrown when using the term aggs builder with another bucket type.
     */
    public function testInvalidBucketAggregationBuild(): void
    {
        $this->expectExceptionMessage('Aggregation assembler : invalid aggregation type invalidType.');
        $this->expectException(\InvalidArgumentException::class);
        $multiTermBucket = $this->getMockBuilder(BucketInterface::class)->getMock();
        $multiTermBucket->method('getType')->willReturn('invalidType');

        $this->getAggregationAssembler()->assembleAggregation($multiTermBucket);
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
        $multiTermBucket = new MultiTerms('aggregationName', 'fieldName', ['otherFieldName'], [], null, null, null, $size);

        $aggregation = $aggBuilder->assembleAggregation($multiTermBucket);

        $this->assertEquals($expected, $aggregation['multi_terms']['size']);
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
    private function getAggregationAssembler(): MultiTermsAssembler
    {
        return new MultiTermsAssembler();
    }
}
