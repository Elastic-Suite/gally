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

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Bucket\Histogram as HistogramAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Bucket\Histogram;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Search adapter histogram aggregation assembler test case.
 */
class HistogramTest extends KernelTestCase
{
    /**
     * Build a histogram aggregation from a bucket.
     */
    public function testBasicAggregationBuild(): void
    {
        $aggBuilder = new HistogramAssembler();
        $bucket = new Histogram('aggregationName', 'fieldName');

        $aggregation = $aggBuilder->assembleAggregation($bucket);

        $this->assertArrayHasKey('histogram', $aggregation);
        $this->assertEquals('fieldName', $aggregation['histogram']['field']);
        $this->assertEquals(1, $aggregation['histogram']['interval']);
        $this->assertEquals(0, $aggregation['histogram']['min_doc_count']);
    }

    /**
     * Build a histogram aggregation from a bucket.
     */
    public function testComplexeAggregationBuild(): void
    {
        $aggBuilder = new HistogramAssembler();
        $bucket = new Histogram('aggregationName', 'fieldName', [], null, null, null, 10, 20);

        $aggregation = $aggBuilder->assembleAggregation($bucket);

        $this->assertArrayHasKey('histogram', $aggregation);
        $this->assertEquals('fieldName', $aggregation['histogram']['field']);
        $this->assertEquals(10, $aggregation['histogram']['interval']);
        $this->assertEquals(20, $aggregation['histogram']['min_doc_count']);
    }

    /**
     * Test an exception is thrown when using the term aggs builder with another bucket type.
     */
    public function testInvalidBucketAggregationBuild(): void
    {
        $aggBuilder = new HistogramAssembler();
        $this->expectExceptionMessage('Aggregation assembler : invalid aggregation type invalidType.');
        $this->expectException(\InvalidArgumentException::class);
        $termsBucket = $this->getMockBuilder(BucketInterface::class)->getMock();
        $termsBucket->method('getType')->willReturn('invalidType');

        $aggBuilder->assembleAggregation($termsBucket);
    }
}
