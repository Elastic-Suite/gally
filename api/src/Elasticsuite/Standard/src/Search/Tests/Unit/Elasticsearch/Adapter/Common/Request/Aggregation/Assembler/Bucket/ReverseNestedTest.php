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

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Bucket\ReverseNested as ReverseNestedAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Bucket\ReverseNested;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Search adapter reverse nested aggregation assembler test case.
 */
class ReverseNestedTest extends KernelTestCase
{
    /**
     * Build a reverse nested aggregation from a bucket.
     */
    public function testReverseNestedAggregationBuild(): void
    {
        $aggBuilder = new ReverseNestedAssembler();
        $bucket = new ReverseNested('aggregationName', 'fieldName');

        $aggregation = $aggBuilder->assembleAggregation($bucket);

        $this->assertArrayHasKey('reverse_nested', $aggregation);
        $this->assertIsObject($aggregation['reverse_nested']);
    }

    /**
     * Test an exception is thrown when using the term aggs builder with another bucket type.
     */
    public function testInvalidBucketAggregationBuild(): void
    {
        $aggBuilder = new ReverseNestedAssembler();
        $this->expectExceptionMessage('Aggregation assembler : invalid aggregation type invalidType.');
        $this->expectException(\InvalidArgumentException::class);
        $termsBucket = $this->getMockBuilder(BucketInterface::class)->getMock();
        $termsBucket->method('getType')->willReturn('invalidType');

        $aggBuilder->assembleAggregation($termsBucket);
    }
}
