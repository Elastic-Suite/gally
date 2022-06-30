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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Pipeline;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Pipeline\BucketSelector as BucketSelectorAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Pipeline\BucketSelector;
use Elasticsuite\Search\Elasticsearch\Request\PipelineInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Search adapter bucket selector aggregation assembler test case.
 */
class BucketSelectorTest extends KernelTestCase
{
    /**
     * Build a bucket selector aggregation from a bucket.
     */
    public function testBasicAggregationBuild(): void
    {
        $aggBuilder = new BucketSelectorAssembler();
        $pipeline = new BucketSelector('aggregationName', 'bucket.path', 'testScript');

        $aggregation = $aggBuilder->assembleAggregation($pipeline);

        $this->assertArrayHasKey('bucket_selector', $aggregation);
        $this->assertEquals('bucket.path', $aggregation['bucket_selector']['buckets_path']);
        $this->assertEquals('testScript', $aggregation['bucket_selector']['script']);
        $this->assertEquals(PipelineInterface::GAP_POLICY_SKIP, $aggregation['bucket_selector']['gap_policy']);
    }

    /**
     * Build a bucket selector aggregation from a bucket.
     */
    public function testComplexeAggregationBuild(): void
    {
        $aggBuilder = new BucketSelectorAssembler();
        $pipeline = new BucketSelector('aggregationName', 'bucket.path', 'testScript', PipelineInterface::GAP_POLICY_INSERT_ZEROS);

        $aggregation = $aggBuilder->assembleAggregation($pipeline);

        $this->assertArrayHasKey('bucket_selector', $aggregation);
        $this->assertEquals('bucket.path', $aggregation['bucket_selector']['buckets_path']);
        $this->assertEquals('testScript', $aggregation['bucket_selector']['script']);
        $this->assertEquals(PipelineInterface::GAP_POLICY_INSERT_ZEROS, $aggregation['bucket_selector']['gap_policy']);
    }

    /**
     * Test an exception is thrown when using the term aggs builder with another bucket type.
     */
    public function testInvalidBucketAggregationBuild(): void
    {
        $aggBuilder = new BucketSelectorAssembler();
        $this->expectExceptionMessage('Aggregation assembler : invalid pipeline type invalidType.');
        $this->expectException(\InvalidArgumentException::class);
        $pipeline = $this->getMockBuilder(PipelineInterface::class)->getMock();
        $pipeline->method('getType')->willReturn('invalidType');

        $aggBuilder->assembleAggregation($pipeline);
    }
}
